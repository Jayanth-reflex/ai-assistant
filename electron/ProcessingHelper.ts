// ProcessingHelper.ts

import { AppState } from "./main"
import { LLMHelper } from "./LLMHelper"
import dotenv from "dotenv"
import path from "path"
import fs from "fs"

dotenv.config()

const isDev = process.env.NODE_ENV === "development"
const isDevTest = process.env.IS_DEV_TEST === "true"
const MOCK_API_WAIT_TIME = Number(process.env.MOCK_API_WAIT_TIME) || 500

export class ProcessingHelper {
  private appState: AppState
  private llmHelper: LLMHelper | null = null
  private currentProcessingAbortController: AbortController | null = null
  private currentExtraProcessingAbortController: AbortController | null = null

  constructor(appState: AppState) {
    this.appState = appState
  }

  public async getLLMHelper(): Promise<LLMHelper> {
    if (!this.llmHelper) {
      const configPath = path.join(require('electron').app.getPath('userData'), 'config.json')
      let apiKey = ''
      
      try {
        if (fs.existsSync(configPath)) {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
          apiKey = config.apiKey || ''
        }
      } catch (error) {
        console.error('Error reading config file:', error)
      }
      
      if (!apiKey) {
        throw new Error("Gemini API key not found. Please set it in Settings.")
      }
      
      this.llmHelper = new LLMHelper(apiKey)
    }
    return this.llmHelper
  }

  public async processScreenshots(inputQueue?: Array<{ type: 'screenshot' | 'audio' | 'text', value: string }>): Promise<void> {
    const mainWindow = this.appState.getMainWindow()
    if (!mainWindow) return

    const view = this.appState.getView()

    // If inputQueue is provided, use it; otherwise, fall back to screenshot queue
    let queue = inputQueue
    if (!queue) {
      const screenshotQueue = this.appState.getScreenshotHelper().getScreenshotQueue()
      queue = screenshotQueue.map((path) => {
        if (path.endsWith('.mp3') || path.endsWith('.wav')) {
          return { type: 'audio' as const, value: path }
        } else if (path.endsWith('.txt')) {
          return { type: 'text' as const, value: path }
        } else {
          return { type: 'screenshot' as const, value: path }
        }
      })
    }

    if (view === "queue") {
      if (!queue || queue.length === 0) {
        mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.NO_SCREENSHOTS)
        return
      }

      mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.INITIAL_START)
      this.appState.setView('solutions')

      let combinedText = ''
      let inputTypes: Array<'screenshot' | 'audio' | 'text'> = []
      try {
        for (const item of queue) {
          inputTypes.push(item.type)
          if (item.type === 'screenshot') {
            const llmHelper = await this.getLLMHelper()
            const imageResult = await llmHelper.analyzeImageFile(item.value)
            combinedText += imageResult.text + '\n'
          } else if (item.type === 'audio') {
            const llmHelper = await this.getLLMHelper()
            const audioResult = await llmHelper.analyzeAudioFile(item.value)
            combinedText += audioResult.text + '\n'
          } else if (item.type === 'text') {
            const textContent = await this.readTextFile(item.value)
            const llmHelper = await this.getLLMHelper()
            const textResult = await llmHelper.analyzeTextInput(textContent)
            combinedText += textResult.text + '\n'
          }
        }
        const problemInfo = {
          problem_statement: combinedText.trim(),
          input_types: inputTypes,
          input_format: { description: "Generated from input queue", parameters: [] as any[] },
          output_format: { description: "Generated from input queue", type: "string", subtype: "text" },
          complexity: { time: "N/A", space: "N/A" },
          test_cases: [] as any[],
          validation_type: "manual",
          difficulty: "custom"
        }
        mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.PROBLEM_EXTRACTED, problemInfo)
        this.appState.setProblemInfo(problemInfo)
        this.appState.clearQueues()
        return
      } catch (err: any) {
        console.error('Processing error:', err)
        mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR, err.message)
        this.appState.clearQueues()
        return
      }
    } else {
      // Debug mode
      const extraScreenshotQueue = this.appState.getScreenshotHelper().getExtraScreenshotQueue()
      if (extraScreenshotQueue.length === 0) {
        console.log("No extra screenshots to process")
        mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.NO_SCREENSHOTS)
        return
      }

      mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.DEBUG_START)
      this.currentExtraProcessingAbortController = new AbortController()

      try {
        // Get problem info and current solution
        const problemInfo = this.appState.getProblemInfo()
        if (!problemInfo) {
          throw new Error("No problem info available")
        }

        // Get current solution from state
        const llmHelper = await this.getLLMHelper()
        const currentSolution = await llmHelper.generateSolution(problemInfo)
        const currentCode = currentSolution.text // Now returns {text, timestamp}

        // Debug the solution using vision model
        const debugResult = await llmHelper.debugSolutionWithImages(
          problemInfo,
          currentCode,
          extraScreenshotQueue
        )

        this.appState.setHasDebugged(true)
        mainWindow.webContents.send(
          this.appState.PROCESSING_EVENTS.DEBUG_SUCCESS,
          debugResult
        )

      } catch (error: any) {
        console.error("Debug processing error:", error)
        mainWindow.webContents.send(
          this.appState.PROCESSING_EVENTS.DEBUG_ERROR,
          error.message
        )
      } finally {
        this.currentExtraProcessingAbortController = null
      }
    }
  }

  public cancelOngoingRequests(): void {
    if (this.currentProcessingAbortController) {
      this.currentProcessingAbortController.abort()
      this.currentProcessingAbortController = null
    }

    if (this.currentExtraProcessingAbortController) {
      this.currentExtraProcessingAbortController.abort()
      this.currentExtraProcessingAbortController = null
    }

    this.appState.setHasDebugged(false)
  }

  public async processAudioBase64(data: string, mimeType: string) {
    // Directly use LLMHelper to analyze inline base64 audio
    const llmHelper = await this.getLLMHelper()
    return llmHelper.analyzeAudioFromBase64(data, mimeType);
  }

  // Add audio file processing method
  public async processAudioFile(filePath: string) {
    const llmHelper = await this.getLLMHelper()
    return llmHelper.analyzeAudioFile(filePath);
  }

  // Add text file reading method
  public async readTextFile(filePath: string): Promise<string> {
    const fs = require('fs');
    return await fs.promises.readFile(filePath, 'utf-8');
  }
}
