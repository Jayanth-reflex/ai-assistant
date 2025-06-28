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
    if (!mainWindow) {
      console.error('Main window not available for processing')
      return
    }

    const view = this.appState.getView()

    // If inputQueue is provided, use it; otherwise, fall back to screenshot queue
    let queue = inputQueue
    if (!queue) {
      try {
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
      } catch (error) {
        console.error('Error preparing queue:', error)
        mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR, 'Failed to prepare processing queue')
        return
      }
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
      let processingErrors: string[] = []
      
      try {
        // Process items in parallel for better performance
        const llmHelper = await this.getLLMHelper()
        
        const processingPromises = queue.map(async (item, index) => {
          try {
            inputTypes.push(item.type)
            console.log(`Processing item ${index + 1}/${queue.length}: ${item.type}`)
            
            if (item.type === 'screenshot') {
              const imageResult = await llmHelper.analyzeImageFile(item.value)
              return imageResult.text
            } else if (item.type === 'audio') {
              const audioResult = await llmHelper.analyzeAudioFile(item.value)
              return audioResult.text
            } else if (item.type === 'text') {
              const textContent = await this.readTextFile(item.value)
              const textResult = await llmHelper.analyzeTextInput(textContent)
              return textResult.text
            }
            return ''
          } catch (error) {
            const errorMsg = `Failed to process ${item.type} item: ${error instanceof Error ? error.message : 'Unknown error'}`
            console.error(errorMsg)
            processingErrors.push(errorMsg)
            return `[Processing Error: ${errorMsg}]`
          }
        })
        
        // Wait for all processing to complete
        const results = await Promise.all(processingPromises)
        combinedText = results.join('\n')
        
        // Check if we have any meaningful content
        if (!combinedText || combinedText.trim().length === 0) {
          throw new Error('No content could be extracted from any input items')
        }
        
        // If we had processing errors, add them to the combined text
        if (processingErrors.length > 0) {
          combinedText += '\n\nProcessing Notes:\n' + processingErrors.join('\n')
        }
        
        const problemInfo = {
          problem_statement: combinedText.trim(),
          input_types: inputTypes,
          input_format: { description: "Generated from input queue", parameters: [] as any[] },
          output_format: { description: "Generated from input queue", type: "string", subtype: "text" },
          complexity: { time: "N/A", space: "N/A" },
          test_cases: [] as any[],
          validation_type: "manual",
          difficulty: "custom",
          processing_errors: processingErrors.length > 0 ? processingErrors : undefined
        }
        
        mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.PROBLEM_EXTRACTED, problemInfo)
        this.appState.setProblemInfo(problemInfo)
        this.appState.clearQueues()
        
        if (processingErrors.length > 0) {
          console.warn(`Processing completed with ${processingErrors.length} errors`)
        } else {
          console.log('Processing completed successfully')
        }
        
        return
      } catch (err: any) {
        console.error('Processing error:', err)
        const errorMessage = err.message || 'Unknown processing error occurred'
        mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR, errorMessage)
        this.appState.clearQueues()
        return
      }
    } else {
      // Debug mode
      try {
        const extraScreenshotQueue = this.appState.getScreenshotHelper().getExtraScreenshotQueue()
        if (extraScreenshotQueue.length === 0) {
          console.log("No extra screenshots to process")
          mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.NO_SCREENSHOTS)
          return
        }

        mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.DEBUG_START)
        this.currentExtraProcessingAbortController = new AbortController()

        // Get problem info and current solution
        const problemInfo = this.appState.getProblemInfo()
        if (!problemInfo) {
          throw new Error("No problem info available for debugging")
        }

        // Get current solution from state
        const llmHelper = await this.getLLMHelper()
        const currentSolution = await llmHelper.generateSolution(problemInfo)
        const currentCode = currentSolution.text

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
        const errorMessage = error.message || 'Unknown debug processing error'
        mainWindow.webContents.send(
          this.appState.PROCESSING_EVENTS.DEBUG_ERROR,
          errorMessage
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
