import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai"
import fs from "fs"

/**
 * @file LLMHelper.ts
 * @description
 *   Core AI processing engine for the AI Meetings Assistant. Handles all interactions with the Gemini LLM API, providing unified processing for text, audio, and image inputs. Responsible for intelligent categorization, structured response generation, robust error handling, and timeout protection for API calls. This class is central to the application's AI-driven interview coaching capabilities.
 *
 * Architecture Role:
 *   - Serves as the main interface between the application and the Gemini LLM API.
 *   - Implements a unified pipeline for all input types (text, audio, image).
 *   - Provides category-specific prompt engineering and response formatting.
 *   - Ensures reliability and user experience through error handling and retry logic.
 *
 * Usage:
 *   Instantiate with a valid Gemini API key and use the public API methods to process various input types.
 *
 * @author UAT
 * @copyright MIT
 */
export class LLMHelper {
  /**
   * The generative model instance from the Gemini API.
   * Used for all LLM content generation requests.
   * @private
   */
  private model: GenerativeModel
  
  /**
   * Classification categories for interview questions.
   * These determine which specialized prompt template to use for response generation.
   * @private
   * @readonly
   */
  private readonly categories = {
    algorithm: "algorithm",
    technical: "technical",
    debugging_optimization: "debugging_optimization",
    general: "general"
  }
  
  /**
   * Specialized prompts for different interview scenarios.
   * Each prompt is optimized for its specific category and follows a structured format.
   * @private
   * @readonly
   */
  private readonly prompts = {
    algorithm: `You are a world-class software engineer providing optimal algorithmic solutions for high-stakes technical interviews.

CRITICAL QUALITY REQUIREMENTS: (INTERNAL ANALYSIS PROCESS)
- Provide the MOST OPTIMAL time and space complexity solution
- Handle ALL edge cases comprehensively (empty inputs, nulls, single elements, duplicates, overflow, etc.)
- Write production-ready, clean, comment for literally each line of code on top of it.
- Must pass all test cases
- You MUST NEVER just summarize what's on the screen
- Complexity Analysis must always include both Time and Space Complexity, with a brief justification in 1 line. If unknown, write 'N/A' and explain why in 1 line.

INTERNAL ANALYSIS PROCESS: (INTERNAL ANALYSIS PROCESS)
1. **Problem Deconstruction:** Analyze constraints, requirements, and expected complexity
2. **Algorithm Selection:** Compare all viable approaches (brute-force, greedy, DP, divide & conquer, etc.)
3. **Optimal Choice:** Select the algorithm with absolute best time/space complexity
4. **Edge Case Enumeration:** Identify ALL possible edge cases systematically
5. **Implementation:** Write flawless, production-quality code with line-by-line comments
6. **Validation:** Dry-run against all edge cases and test cases

MANDATORY RESPONSE FORMAT:
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
\`\`\`
`,

    technical: `You are a senior technical architect explaining complex concepts for high-stakes interviews.

Category: Technical

**Direct Answer:**
[Provide a clear, immediate answer to the question.]

Pseudo-Code (only if applicable):
Provide a concise, commented code example in [language] if it clarifies the explanation.
\`\`\`[language]
// Your sample pseudo-code here
\`\`\`

If multiple choice, start with the answer, then explain why it's correct and why the other options are incorrect.

Do not add any additional context, explanations, or notes outside the required sections. The order of sections must be exactly as shown above.`,

    debugging_optimization: `You are an expert debugger analyzing and resolving complex technical issues.

DEBUGGING EXCELLENCE STANDARDS: (INTERNAL ANALYSIS PROCESS)
- Identify root cause with precision
- Provide comprehensive fix with all edge cases
- Explain optimization reasoning
- Include prevention strategies

RESPONSE FORMAT:
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
- [Edge cases now handled] (1-2 lines)`,

    general: `You must follow the exact response format below. Do not add or omit any sections. Do not include any extra explanations or context outside the format. The order of sections must be exactly as shown below.

As an AI assistant, provide a direct and concise answer to the user's question. [maxOutputTokens: 50 words]

RESPONSE FORMAT (follow exactly):
Category: General

**Direct Answer:** [maxOutputTokens: 50 words]
[Provide a clear, immediate answer to the question directly.]

Do not add any additional context, explanations, or notes outside the required sections. The order of sections must be exactly as shown above.`
  }

  /**
   * Initialize the LLMHelper with Gemini API configuration.
   * @param {string} apiKey - Gemini API key for authentication.
   * @param {string} modelName - Gemini model name (supports 2.0-flash, 2.0-pro, 2.5-flash, 2.5-pro).
   */
  constructor(apiKey: string, modelName: string = 'gemini-2.0-flash') {
    console.log(`[LLMHelper] Initializing with model: ${modelName}`)
    const genAI = new GoogleGenerativeAI(apiKey)
    // Optimize model configuration for faster responses
    this.model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        maxOutputTokens: 2048, // Limit response length for faster generation
        temperature: 0.2, // Slightly lower temperature for more focused responses
        topK: 3, // Limit token selection for faster processing
        topP: 0.85 // Nucleus sampling for better quality/speed balance
      }
    })
  }

  /**
   * Helper method to add timeout to API calls.
   * Prevents hanging requests and provides better user experience.
   * @param {string | (string | any)[]} prompt - The prompt to send to the LLM.
   * @param {number} [timeoutMs=50000] - Timeout in milliseconds (default: 50 seconds).
   * @returns {Promise<any>} Promise with the LLM response.
   */
  public async generateContentWithTimeout(prompt: string | (string | any)[], timeoutMs: number = 50000) {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    })
    
    const contentPromise = this.model.generateContent(prompt)
    
    try {
      const result = await Promise.race([contentPromise, timeoutPromise])
      return result
    } catch (error) {
      console.error('API call failed or timed out:', error)
      throw error
    }
  }

  /**
   * Input validation and sanitization.
   * Ensures all inputs meet quality standards before processing.
   * @param {any} content - The input content to validate.
   * @param {'text' | 'audio' | 'image'} inputType - Type of input (text, audio, or image).
   * @throws Will throw an error if the input is invalid.
   * @private
   */
  private validateInput(content: any, inputType: 'text' | 'audio' | 'image'): void {
    if (!content) {
      throw new Error(`${inputType} input is null or undefined`)
    }

    if (inputType === 'text') {
      if (typeof content !== 'string') {
        throw new Error('Text input must be a string')
      }
      if (content.trim().length === 0) {
        throw new Error('Text input cannot be empty')
      }
      if (content.length > 10000) {
        throw new Error('Text input is too long (max 10,000 characters)')
      }
    } else if (inputType === 'audio') {
      if (!content.inlineData || !content.inlineData.data) {
        throw new Error('Audio input must have valid inline data')
      }
      if (content.inlineData.data.length === 0) {
        throw new Error('Audio input data is empty')
      }
    } else if (inputType === 'image') {
      if (!content.inlineData || !content.inlineData.data) {
        throw new Error('Image input must have valid inline data')
      }
      if (content.inlineData.data.length === 0) {
        throw new Error('Image input data is empty')
      }
    }
  }

  /**
   * AI-powered classification with combined classify+generate approach.
   * This is the core method that handles all input types with intelligent categorization.
   * @param {string | any[] | any} content - The input content (text, audio, or image).
   * @param {'text' | 'audio' | 'image'} inputType - Type of input for proper processing.
   * @returns {Promise<{text: string, timestamp: number}>} Promise with structured response and timestamp.
   * @private
   */
  private async classifyAndGenerateResponse(content: string | any[] | any, inputType: 'text' | 'audio' | 'image'): Promise<{text: string, timestamp: number}> {
    const maxRetries = 3
    let attempt = 0

    // Validate input before processing
    try {
      this.validateInput(content, inputType)
    } catch (error) {
      console.error('Input validation failed:', error)
      const fallbackResponse = this.generateFallbackResponse(inputType, error as Error)
      return { text: fallbackResponse, timestamp: Date.now() }
    }

    while (attempt < maxRetries) {
      try {
        attempt++
        console.log(`Processing ${inputType} input, attempt ${attempt}/${maxRetries}`)

        // Step 1: Extract text content from input
        let extractedText = ''
        if (inputType === 'text') {
          extractedText = content as string
          if (!extractedText || extractedText.trim().length === 0) {
            throw new Error('Empty or invalid text input')
          }
        } else if (inputType === 'audio') {
          // Extract transcription from audio using LLM
          const audioPart = content as any
          const transcriptionPrompt = "Transcribe this audio clearly and completely.";
          const transcriptionResult = await this.generateContentWithTimeout([transcriptionPrompt, audioPart]);
          extractedText = (await transcriptionResult.response).text();
        
          if (!extractedText || extractedText.trim().length === 0) {
            throw new Error('Audio transcription failed or returned empty result')
          }
        } else if (inputType === 'image') {
          // Extract text from image using OCR via LLM
          const imagePart = content as any
          const ocrPrompt = "Extract all text from this image clearly and completely.";
          const ocrResult = await this.generateContentWithTimeout([ocrPrompt, imagePart]);
          extractedText = (await ocrResult.response).text();
        
          if (!extractedText || extractedText.trim().length === 0) {
            throw new Error('Image OCR failed or returned empty result')
          }
        } 

        // Step 2: Dynamic classification prompt based on content length
        const isLongContent = extractedText.length > 500
        const categoryDefinitions = isLongContent ? 
          "algorithm, technical, debugging_optimization, general" :
          `algorithm (coding problems, DSA, competitive programming), \n           technical (APIs, languages, frameworks, concepts), \n           debugging_optimization (code debugging, performance issues), \n           general (everything else)`

        // Step 3: Extract most category-indicative snippet for long content
        const contentSnippet = isLongContent ? 
          this.extractCategoryIndicativeSnippet(extractedText) : 
          extractedText

        // Step 4: Combined classification and response generation
        const combinedPrompt = `You are an AI interview assistant. Your task is to:\n\n1. CLASSIFY the input into exactly one category: ${categoryDefinitions}\n\n2. GENERATE a structured interview response using the appropriate format.\n\nInput Type: ${inputType}\nContent: ${contentSnippet}\n\nClassification Task: Return ONLY the category name (algorithm, technical, debugging_optimization, or general)\n\nResponse Task: Based on the classification, provide a structured interview coaching response following the exact format for that category.\n\nReturn your response in this format:\nCATEGORY: [category_name]\nRESPONSE: [structured_response]`

        const result = await this.generateContentWithTimeout(combinedPrompt)
        const responseText = (await result.response).text()
        
        if (!responseText || responseText.trim().length === 0) {
          throw new Error('AI response generation failed or returned empty result')
        }

        // Step 5: Parse the combined response
        const lines = responseText.split('\n')
        let category = 'general' // default fallback
        let response = responseText

        for (const line of lines) {
          if (line.startsWith('CATEGORY:')) {
            category = line.replace('CATEGORY:', '').trim().toLowerCase()
            break
          }
        }

        // Validate category
        const validCategories = Object.values(this.categories)
        if (!validCategories.includes(category)) {
          console.warn(`Invalid category detected: ${category}, using general`)
          category = 'general'
        }

        // Step 6: Apply the appropriate prompt structure if needed
        if (category in this.prompts) {
          const structuredPrompt = `${this.prompts[category as keyof typeof this.prompts]}\n\nAnalyze this ${inputType} input and provide structured interview coaching.`
          const structuredResult = await this.generateContentWithTimeout([structuredPrompt, content])
          response = (await structuredResult.response).text()
          
          if (!response || response.trim().length === 0) {
            throw new Error('Structured response generation failed')
          }
        }

        console.log(`Successfully processed ${inputType} input as category: ${category}`)
        return { text: this.enforceBlankLines(response), timestamp: Date.now() }

      } catch (error) {
        console.error(`Attempt ${attempt} failed for ${inputType} input:`, error)
        
        if (attempt === maxRetries) {
          console.error(`All ${maxRetries} attempts failed for ${inputType} input`)
          // Final fallback with detailed error information
          const fallbackResponse = this.generateFallbackResponse(inputType, error as Error)
          return { text: fallbackResponse, timestamp: Date.now() }
        }
        
        // Wait before retry (exponential backoff)
        const waitTime = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
        console.log(`Waiting ${waitTime}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }

    // This should never be reached, but just in case
    throw new Error('Unexpected error in classification and generation')
  }

  /**
   * Generate fallback response when all attempts fail.
   * Provides helpful error information and guidance to the user.
   * @param {'text' | 'audio' | 'image'} inputType - Type of input that failed.
   * @param {Error} error - The error that occurred.
   * @returns {string} Formatted fallback response.
   * @private
   */
  private generateFallbackResponse(inputType: 'text' | 'audio' | 'image', error: Error): string {
    const timestamp = new Date().toISOString()
    const errorInfo = error.message || 'Unknown error'
    
    return `Category: General\n\nAnalysis:\n- Input processing encountered an issue\n- Error: ${errorInfo}\n- Timestamp: ${timestamp}\n\nGuidance:\n- Please try again with a different input or format\n- Ensure your ${inputType} input is clear and complete\n- Check your internet connection if the issue persists\n\nNext Steps:\n- Retry with a simpler input\n- Try using a different input method (text instead of ${inputType})\n- Contact support if the issue continues\n\nInterview Tips:\n- Always have a backup plan for technical difficulties\n- Practice explaining problems in multiple formats\n- Be prepared to adapt to unexpected situations\n\nRelevance: Medium\nEstimated Time: 5 minutes\n\nNote: This is a fallback response due to processing difficulties. Please try again.`
  }

  /**
   * Extract most category-indicative snippet for long content.
   * Uses keyword analysis to identify the most relevant category for classification.
   * @param {string} text - The full text content.
   * @returns {string} Snippet optimized for category classification.
   * @private
   */
  private extractCategoryIndicativeSnippet(text: string): string {
    const words = text.split(' ')
    if (words.length <= 100) return text
    
    // Look for category-indicative keywords in the first 100 words
    const first100Words = words.slice(0, 100).join(' ')
    const categoryKeywords = {
      algorithm: ['algorithm', 'array', 'sort', 'search', 'tree', 'graph', 'leetcode', 'hackerrank', 'coding', 'problem'],
      technical: ['api', 'framework', 'language', 'technology', 'concept', 'how', 'what', 'explain'],
      debugging_optimization: ['error', 'bug', 'debug', 'performance', 'optimization', 'fix', 'issue']
    }

    // Find the most relevant category based on keyword density
    let bestCategory = 'general'
    let maxScore = 0

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        const regex = new RegExp(keyword, 'gi')
        return acc + (first100Words.match(regex)?.length || 0)
      }, 0)
      
      if (score > maxScore) {
        maxScore = score
        bestCategory = category
      }
    }

    // Return a snippet that includes category-indicative content
    if (maxScore > 0) {
      return first100Words + ' [Content continues...]'
    }
    
    return words.slice(0, 50).join(' ') + ' [Content continues...]'
  }

  /**
   * Convert image file to generative part for LLM processing.
   * @param {string} imagePath - Path to the image file.
   * @returns {Promise<{inlineData: {data: string, mimeType: string}}>} Generative part object for LLM API.
   */
  public async fileToGenerativePart(imagePath: string) {
    const imageData = await fs.promises.readFile(imagePath)
    const ext = imagePath.split('.').pop()?.toLowerCase()
    let mimeType = "image/png"
    if (ext === "jpg" || ext === "jpeg") {
      mimeType = "image/jpeg"
    }
    return {
      inlineData: {
        data: imageData.toString("base64"),
        mimeType
      }
    }
  }

  /**
   * Enforce consistent blank lines in response formatting.
   * Ensures proper spacing between sections for better readability.
   * @param {string} text - The response text to format.
   * @returns {string} Properly formatted text with consistent spacing.
   * @private
   */
  private enforceBlankLines(text: string): string {
    // Insert a newline after each heading, even if content is on the same line
    let processed = text.replace(
      /(Category|Problem Analysis|Requirements Analysis|STAR Framework Analysis|Concept Breakdown|Problem Analysis|Analysis|Optimal Approach|High-Level Architecture|Leadership Indicators|Depth Levels|Common Misconceptions|Debugging Strategy|Tools & Techniques|Interview Tips|Difficulty|Complexity|Strength Level|Knowledge Level|Relevance|Estimated Time): ?/g,
      '$1:\n'
    );
    // Add an extra blank line between sections (if not already present)
    processed = processed.replace(
      /(Category|Problem Analysis|Requirements Analysis|STAR Framework Analysis|Concept Breakdown|Problem Analysis|Analysis|Optimal Approach|High-Level Architecture|Leadership Indicators|Depth Levels|Common Misconceptions|Debugging Strategy|Tools & Techniques|Interview Tips|Difficulty|Complexity|Strength Level|Knowledge Level|Relevance|Estimated Time):\n([\s\S]*?)(?=(Category|Problem Analysis|Requirements Analysis|STAR Framework Analysis|Concept Breakdown|Problem Analysis|Analysis|Optimal Approach|High-Level Architecture|Leadership Indicators|Depth Levels|Common Misconceptions|Debugging Strategy|Tools & Techniques|Interview Tips|Difficulty|Complexity|Strength Level|Knowledge Level|Relevance|Estimated Time):|$)/g,
      (_, heading, content) => `${heading}:\n${content.trim()}\n\n`
    );
    return processed.trim();
  }

  // ===== PUBLIC API METHODS =====
  // These methods provide the main interface for different input types

  /**
   * Process multiple screenshots as a unified problem.
   * Uses world-class approach to combine all images into a single coherent analysis.
   * @param {string[]} imagePaths - Array of image file paths.
   * @returns {Promise<{text: string, timestamp: number}>} Structured response with timestamp.
   */
  public async extractProblemFromImages(imagePaths: string[]) {
    const imageParts = await Promise.all(
      imagePaths.map(this.fileToGenerativePart.bind(this))
    )
    
    // Use unified processing for images
    return this.classifyAndGenerateResponse(imageParts, 'image')
  }

  /**
   * Generate solution for problem information.
   * @param {any} problemInfo - Problem information object.
   * @returns {Promise<{text: string, timestamp: number}>} Structured solution response.
   */
  public async generateSolution(problemInfo: any) {
    // For problem info, treat as text input
    const problemText = JSON.stringify(problemInfo, null, 2)
    return this.classifyAndGenerateResponse(problemText, 'text')
  }

  /**
   * Debug solution using additional screenshots.
   * @param {any} problemInfo - Original problem information.
   * @param {string} currentCode - Current solution code.
   * @param {string[]} debugImagePaths - Additional debug screenshots.
   * @returns {Promise<{text: string, timestamp: number}>} Debugged solution response.
   */
  public async debugSolutionWithImages(problemInfo: any, currentCode: string, debugImagePaths: string[]) {
    const imageParts = await Promise.all(
      debugImagePaths.map(this.fileToGenerativePart.bind(this))
    )
    
    // Combine problem info, code, and images for debugging classification
    const combinedContent = `Problem: ${JSON.stringify(problemInfo)}\nCode: ${currentCode}\nDebug Images: [Multiple images provided]`
    return this.classifyAndGenerateResponse(combinedContent, 'text')
  }

  /**
   * Analyze audio file from file path.
   * @param {string} audioPath - Path to audio file.
   * @returns {Promise<{text: string, timestamp: number}>} Structured response with transcription and analysis.
   */
  public async analyzeAudioFile(audioPath: string) {
    const audioData = await fs.promises.readFile(audioPath)
    const audioPart = {
      inlineData: {
        data: audioData.toString("base64"),
        mimeType: "audio/mp3"
      }
    }
    
    // Use unified processing for audio
    return this.classifyAndGenerateResponse(audioPart, 'audio')
  }

  /**
   * Analyze audio from base64 data.
   * @param {string} data - Base64 encoded audio data.
   * @param {string} mimeType - MIME type of the audio.
   * @returns {Promise<{text: string, timestamp: number}>} Structured response with transcription and analysis.
   */
  public async analyzeAudioFromBase64(data: string, mimeType: string) {
    const audioPart = { inlineData: { data, mimeType } }
    
    // Use unified processing for audio
    return this.classifyAndGenerateResponse(audioPart, 'audio')
  }

  /**
   * Analyze single image file.
   * @param {string} imagePath - Path to image file.
   * @returns {Promise<{text: string, timestamp: number}>} Structured response with image analysis.
   */
  public async analyzeImageFile(imagePath: string) {
    const imageData = await fs.promises.readFile(imagePath)
    const ext = imagePath.split('.').pop()?.toLowerCase()
    let mimeType = "image/png"
    if (ext === "jpg" || ext === "jpeg") {
      mimeType = "image/jpeg"
    }
    const imagePart = { inlineData: { data: imageData.toString("base64"), mimeType } }
    
    // Use unified processing for images
    return this.classifyAndGenerateResponse(imagePart, 'image')
  }

  /**
   * Analyze text input.
   * @param {string} text - Text input string.
   * @returns {Promise<{text: string, timestamp: number}>} Structured response with analysis.
   */
  public async analyzeTextInput(text: string) {
    // Use unified processing for text
    return this.classifyAndGenerateResponse(text, 'text')
  }
}