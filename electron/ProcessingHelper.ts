/**
 * @file ProcessingHelper.ts
 * @description
 *   Core orchestration engine for the AI Meetings Assistant. Manages the complete processing pipeline for all input types (screenshots, audio, text, mixed), coordinates queue management, error handling, and state transitions. Implements world-class multi-image processing and robust fallback mechanisms for technical interview coaching.
 *
 * Architecture Role:
 *   - Orchestrates the flow of data and processing between UI, LLM, and input sources.
 *   - Handles queue and debug modes, state management, and error propagation.
 *   - Integrates with LLMHelper for AI-powered content generation and analysis.
 *
 * Usage:
 *   Instantiate with the application state and use public methods to process screenshots, audio, and text inputs.
 *
 * @author UAT
 * @copyright MIT
 */

import { AppState } from "./main"
import { LLMHelper } from "./LLMHelper"
import dotenv from "dotenv"
import path from "path"
import fs from "fs"

dotenv.config()

const isDev = process.env.NODE_ENV === "development"
const isDevTest = process.env.IS_DEV_TEST === "true"
const MOCK_API_WAIT_TIME = Number(process.env.MOCK_API_WAIT_TIME) || 500

/**
 * ProcessingHelper - Core orchestration engine for the interview assistant
 * 
 * This class manages the complete processing pipeline for all input types:
 * - Screenshots (images) - Combined multi-image analysis
 * - Audio files - Transcription and analysis
 * - Text files - Direct LLM processing
 * - Mixed inputs - Intelligent combination and processing
 * 
 * Key Features:
 * - World-class multi-image processing that treats multiple screenshots as one problem
 * - Unified processing pipeline for all input types
 * - Robust error handling with detailed fallback responses
 * - Queue management and state coordination
 * - Debug mode for iterative problem solving
 */
export class ProcessingHelper {
  /**
   * Reference to the application state for accessing UI, queues, and events.
   * @private
   */
  private appState: AppState
  /**
   * Cached instance of LLMHelper for LLM operations. Lazily initialized.
   * @private
   */
  private llmHelper: LLMHelper | null = null
  /**
   * Abort controller for canceling ongoing processing requests.
   * @private
   */
  private currentProcessingAbortController: AbortController | null = null
  /**
   * Abort controller for canceling extra (debug) processing requests.
   * @private
   */
  private currentExtraProcessingAbortController: AbortController | null = null

  /**
   * Construct a new ProcessingHelper.
   * @param {AppState} appState - The application state instance.
   */
  constructor(appState: AppState) {
    this.appState = appState
  }

  /**
   * Get or create LLMHelper instance with API key from config.
   * @returns {Promise<LLMHelper>} Promise resolving to configured LLMHelper.
   * @throws {Error} If API key is not configured or config file is missing.
   */
  public async getLLMHelper(): Promise<LLMHelper> {
    if (!this.llmHelper) {
      const configPath = path.join(require('electron').app.getPath('userData'), 'config.json')
      let apiKey = ''
      let model = 'gemini-2.0-flash' // Default model
      
      try {
        if (fs.existsSync(configPath)) {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
          apiKey = config.apiKey || ''
          model = config.model || 'gemini-2.0-flash'
        }
      } catch (error) {
        console.error('Error reading config file:', error)
      }
      
      if (!apiKey) {
        throw new Error("Gemini API key not found. Please set it in Settings.")
      }
      
      console.log(`[ProcessingHelper] Initializing LLMHelper with model: ${model}`)
      this.llmHelper = new LLMHelper(apiKey, model)
    }
    return this.llmHelper
  }

  /**
   * Main processing method for all input types.
   * Implements a world-class approach to processing screenshots, audio, text, and mixed inputs.
   * Handles both queue mode (initial processing) and debug mode (iterative improvement).
   * @param {Array<{ type: 'screenshot' | 'audio' | 'text', value: string }>} [inputQueue] - Optional queue of input items with type and path.
   * @returns {Promise<void>} Resolves when processing is complete.
   */
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
      // ===== QUEUE MODE: Initial Processing =====
      if (!queue || queue.length === 0) {
        mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.NO_SCREENSHOTS)
        return
      }

      mainWindow.webContents.send(this.appState.PROCESSING_EVENTS.INITIAL_START)
      this.appState.setView('solutions')

      let processingErrors: string[] = []
      
      try {
        const llmHelper = await this.getLLMHelper()
        
        // Separate different input types for specialized processing
        const screenshots = queue.filter(item => item.type === 'screenshot').map(item => item.value)
        const audioFiles = queue.filter(item => item.type === 'audio').map(item => item.value)
        const textFiles = queue.filter(item => item.type === 'text').map(item => item.value)
        
        // Concurrently process text and audio files to optimize response time.
        // This approach uses Promise.allSettled to ensure that all files are processed,
        // even if some of them fail, improving robustness and speed.
        const [textResults, audioResults] = await Promise.all([
          Promise.allSettled(textFiles.map(file => this.readTextFile(file))),
          Promise.allSettled(audioFiles.map(file => llmHelper.analyzeAudioFile(file)))
        ]);

        // Aggregate text content and handle any processing errors.
        const textContext = textResults
          .map((result, index) => {
            if (result.status === 'fulfilled') {
              return result.value;
            }
            const errorMsg = `Failed to read text file ${textFiles[index]}: ${result.reason instanceof Error ? result.reason.message : 'Unknown error'}`;
            processingErrors.push(errorMsg);
            return '';
          })
          .join('\n');

        // Aggregate audio transcriptions and handle any processing errors.
        const audioContext = audioResults
          .map((result, index) => {
            if (result.status === 'fulfilled') {
              return result.value.text;
            }
            const errorMsg = `Failed to process audio file ${audioFiles[index]}: ${result.reason instanceof Error ? result.reason.message : 'Unknown error'}`;
            processingErrors.push(errorMsg);
            return '';
          })
          .join('\n');
        
        // World-class approach: Combine all screenshots into a single coherent problem
        let combinedResult = ''
        
        if (screenshots.length > 0) {
          try {
            // FAANG-level prompt for Gemini LLM: extract, categorize, and solve
            const combinedPrompt = `You are a world-class FAANG senior engineer and technical interviewer. You are given one or more screenshots from a coding interview. Your tasks are:

1. Extract ALL text, code, and relevant information from the images. Be robust to line numbers, code formatting, and diagrams. Ignore any visual noise or irrelevant UI elements.
2. Synthesize the extracted content into a single, clear problem statement. **Do NOT copy, paraphrase, or include the raw input, OCR, constraints, or examples in your response. The response must always start with 'Category:' and follow the provided structure.**
3. Categorize the problem as one of: algorithm, technical, debugging_optimization, or general. Use these definitions:
   - **algorithm:** Coding problems, DSA, competitive programming.
   - **technical:** API, technical languages, frameworks, functions, methods, keywords, or any technical concept questions.
   - **debugging_optimization:** Code debugging, performance issues.
   - **general:** Non-technical, meta, or open-ended questions.
   **If the question is about a programming API, technical languages, frameworks, functions, methods, keywords, or any technical concept questions, always classify as Technical, not General.**
4. Provide a structured, production-quality solution in the SAME programming language as the problem. Use the response format that matches the detected category below. DO NOT mix formats. Strictly follow the format for the chosen category.
5. If the input contains a code structure (e.g., class, main method), preserve and complete it. If not, implement a full, runnable solution with a main function or entry point as required by the language.
6. Complexity Analysis must always include both Time and Space Complexity, with a brief justification in 1 line. If unknown, write 'N/A' and explain why in 1 line.

---
RESPONSE FORMATS (choose exactly one based on your classification):

[algorithm]
Category: Algorithm / DS

**Most Efficient Approach:**
1. **Algorithm Choice:** [Specific algorithm name and why it's optimal] (1-2 lines)
2. **Edge Case Strategy:** [How code handles all critical edge cases] (1-2 lines)

**Optimized Implementation:**
\`\`\`[language]
// Production-ready code with comprehensive edge case handling
// Each line must have meaningful comments explaining the logic
// Code must pass ALL test cases and edge cases
// If the input code structure is present, preserve and complete it. Otherwise, implement a full, runnable solution with a main function.
[Your flawless, optimal solution here]
\`\`\`

**Complexity Analysis:** (You MUST always include both Time Complexity and Space Complexity in the Complexity Analysis section. If you do not, your answer will be considered incomplete and rejected. Be explicit: 'Complexity Analysis:' must always have both.)
- **Time Complexity:** [Always include, never omit. If unknown, write 'N/A' and explain why in 1 line.]
- **Space Complexity:** [Always include, never omit. If unknown, write 'N/A' and explain why in 1 line.]

**Test Case Validation:**
- Handles: [List key edge cases covered]

---

[technical]
Category: Technical

**Direct Answer:**
[Provide a clear, immediate answer to the question.]

Pseudo-Code (only if applicable):
Provide a concise, commented code example in [language] if it clarifies the explanation.
\`\`\`[language]
// Your sample pseudo-code here
\`\`\`

If multiple choice, start with the answer, then explain why it's correct and why the other options are incorrect.

---

[debugging_optimization]
Category: Debugging / Troubleshooting

**Root Cause Analysis:**
- **Primary Issue:** [Specific root cause identification] (1-2 lines)

**Comprehensive Solution:**
\`\`\`[language]
// Fixed code with comprehensive error handling
// Optimized for performance and reliability
// Comments explaining each fix and improvement
[Your debugged and optimized solution here]
\`\`\`

**Optimization Improvements:**
- [Performance enhancements made] (1-2 lines)
- [Edge cases now handled] (1-2 lines)

---

[general]
Category: General

**Direct Answer:** [maxOutputTokens: 50 words]
[Provide a clear, immediate answer to the question directly.]

---

If any section is missing, output 'N/A' for that section, but never omit a section header. If you are unsure, make a best-faith estimate and state your reasoning. Do not mix formats. Do not add or omit sections. The order of sections must be exactly as shown for the chosen category.`

            // Convert all screenshots to generative parts for Gemini LLM
            const imageParts = await Promise.all(
              screenshots.map(async (imagePath) => {
                try {
                  return await llmHelper.fileToGenerativePart(imagePath)
                } catch (error) {
                  const errorMsg = `Failed to process image ${imagePath}: ${error instanceof Error ? error.message : 'Unknown error'}`
                  processingErrors.push(errorMsg)
                  return null
                }
              })
            )
            
            // Filter out failed images
            const validImageParts = imageParts.filter(part => part !== null)
            
            if (validImageParts.length > 0) {
              // Send all images together with the improved prompt
              const result = await llmHelper.generateContentWithTimeout([combinedPrompt, ...validImageParts])
              let rawResponse = (await result.response).text()
              
              // Post-processing: Remove any echoed input/OCR before 'Category:'
              const categoryIndex = rawResponse.indexOf('Category:')
              if (categoryIndex > 0) {
                rawResponse = rawResponse.slice(categoryIndex)
              }
              // Ensure response starts with 'Category:'
              if (!rawResponse.startsWith('Category:')) {
                rawResponse = 'Category: N/A\n' + rawResponse
              }
              // Check for main function (for Java, C++, etc.) and Complexity Analysis
              if (/java|c\+\+|csharp|python|go|typescript|javascript/i.test(rawResponse)) {
                if (!/main\s*\(/i.test(rawResponse)) {
                  rawResponse += '\n\n[Note: Main function or entry point may be missing. Please ensure a complete, runnable solution is provided.]'
                }
              }
              if (!/Time Complexity:/i.test(rawResponse) || !/Space Complexity:/i.test(rawResponse)) {
                rawResponse += '\n\n[Note: Complexity Analysis section was missing or incomplete. Please ensure both Time and Space Complexity are addressed.]'
              }
              combinedResult = this.cleanResponse(rawResponse)
            } else {
              throw new Error('No valid images could be processed')
            }
            
          } catch (error) {
            const errorMsg = `Failed to process combined images: ${error instanceof Error ? error.message : 'Unknown error'}`
            processingErrors.push(errorMsg)
            throw error
          }
        } else if (textFiles.length > 0 && screenshots.length === 0) {
          // Handle text-only inputs by processing through LLM
          try {
            // Process text input through LLM for proper categorization and response
            const textResult = await llmHelper.analyzeTextInput(textContext.trim())
            combinedResult = textResult.text
            
            // Clean up the response to remove any unwanted sections
            combinedResult = this.cleanResponse(combinedResult)
          } catch (error) {
            const errorMsg = `Failed to process text input: ${error instanceof Error ? error.message : 'Unknown error'}`
            processingErrors.push(errorMsg)
            throw error
          }
        } else if (audioFiles.length > 0 && screenshots.length === 0 && textFiles.length === 0) {
          // Handle audio-only inputs by processing through LLM
          try {
            // Process audio input through LLM for proper categorization and response
            const audioResult = await llmHelper.analyzeAudioFile(audioFiles[0])
            combinedResult = audioResult.text
            
            // Clean up the response to remove any unwanted sections
            combinedResult = this.cleanResponse(combinedResult)
          } catch (error) {
            const errorMsg = `Failed to process audio input: ${error instanceof Error ? error.message : 'Unknown error'}`
            processingErrors.push(errorMsg)
            throw error
          }
        }
        
        // Combine all results for mixed input scenarios
        let finalText = combinedResult
        if (audioContext && screenshots.length > 0) {
          finalText = audioContext + '\n\n' + finalText
        }
        if (textContext && screenshots.length > 0) {
          finalText = textContext + '\n\n' + finalText
        }
        
        // Check if we have any meaningful content
        if (!finalText || finalText.trim().length === 0) {
          throw new Error('No content could be extracted from any input items')
        }
        
        // If we had processing errors, add them to the combined text
        if (processingErrors.length > 0) {
          finalText += '\n\nProcessing Notes:\n' + processingErrors.join('\n')
        }
        
        // Create problem info object for the UI
        const problemInfo = {
          problem_statement: finalText.trim(),
          input_types: queue.map(item => item.type),
          input_format: { description: "Generated from combined input queue", parameters: [] as any[] },
          output_format: { description: "Generated from combined input queue", type: "string", subtype: "text" },
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
        mainWindow.webContents.send(
          this.appState.PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR,
          errorMessage
        )
        this.appState.clearQueues()
        return
      }
    } else {
      // ===== DEBUG MODE: Iterative Problem Solving =====
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

  /**
   * Cancel ongoing processing requests.
   * Allows users to interrupt long-running operations.
   * @returns {void}
   */
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

  /**
   * Process audio from base64 data.
   * @param {string} data - Base64 encoded audio data.
   * @param {string} mimeType - MIME type of the audio.
   * @returns {Promise<any>} Promise with audio analysis result.
   */
  public async processAudioBase64(data: string, mimeType: string) {
    // Directly use LLMHelper to analyze inline base64 audio
    const llmHelper = await this.getLLMHelper()
    return llmHelper.analyzeAudioFromBase64(data, mimeType);
  }

  /**
   * Process audio file from path.
   * @param {string} filePath - Path to audio file.
   * @returns {Promise<any>} Promise with audio analysis result.
   */
  public async processAudioFile(filePath: string) {
    const llmHelper = await this.getLLMHelper()
    return llmHelper.analyzeAudioFile(filePath);
  }

  /**
   * Read text file content.
   * @param {string} filePath - Path to text file.
   * @returns {Promise<string>} Promise with file content as string.
   */
  public async readTextFile(filePath: string): Promise<string> {
    const fs = require('fs');
    return await fs.promises.readFile(filePath, 'utf-8');
  }

  /**
   * Clean response by removing unwanted sections.
   * Ensures consistent, focused responses by filtering out unnecessary content.
   * @param {string} response - Raw response from LLM.
   * @returns {string} Cleaned response with consistent formatting.
   * @private
   */
  private cleanResponse(response: string): string {
    // Remove unwanted sections that were in the old prompts
    const unwantedSections = [
      'Interview Tips:',
      'Difficulty:',
      'Estimated Time:',
      'Relevance:',
      'Complexity:',
      'Strength Level:',
      'Knowledge Level:',
      'Tools & Techniques:',
      'Common Misconceptions:',
      'Depth Levels:',
      'Leadership Indicators:',
      'High-Level Architecture:',
      'Requirements Analysis:',
      'STAR Framework Analysis:',
      'Concept Breakdown:'
    ]
    
    let cleanedResponse = response
    
    // Remove each unwanted section and everything after it until the next section
    for (const section of unwantedSections) {
      const sectionIndex = cleanedResponse.indexOf(section)
      if (sectionIndex !== -1) {
        // Find the next section or end of response
        const nextSectionIndex = cleanedResponse.indexOf('\n\n', sectionIndex)
        if (nextSectionIndex !== -1) {
          cleanedResponse = cleanedResponse.substring(0, sectionIndex) + cleanedResponse.substring(nextSectionIndex)
        } else {
          cleanedResponse = cleanedResponse.substring(0, sectionIndex)
        }
      }
    }
    
    // Remove duplicate "Category:" sections (keep only the first one)
    const categoryMatches = cleanedResponse.match(/Category:\s*[^\n]*/g)
    if (categoryMatches && categoryMatches.length > 1) {
      // Keep only the first category section
      const firstCategoryIndex = cleanedResponse.indexOf('Category:')
      const secondCategoryIndex = cleanedResponse.indexOf('Category:', firstCategoryIndex + 1)
      if (secondCategoryIndex !== -1) {
        cleanedResponse = cleanedResponse.substring(0, secondCategoryIndex)
      }
    }
    
    // Clean up extra whitespace and normalize line endings
    cleanedResponse = cleanedResponse
      .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2
      .replace(/\s+$/gm, '') // Remove trailing whitespace from each line
      .trim()
    
    return cleanedResponse
  }
}