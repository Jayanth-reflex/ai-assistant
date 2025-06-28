import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai"
import fs from "fs"

export class LLMHelper {
  private model: GenerativeModel
  
  // Classification categories as specified
  private readonly categories = {
    algorithm: "algorithm",
    system_design: "system_design", 
    behavioral: "behavioral",
    technical: "technical",
    debugging_optimization: "debugging_optimization",
    general: "general"
  }

  // Subcategories for granularity
  private readonly subcategories = {
    algorithm: ["easy", "medium", "hard"],
    system_design: ["high_level", "deep_dive"],
    technical: ["frontend", "backend", "devops"],
    debugging_optimization: ["syntax", "performance"]
  }
  
  // Specialized prompts for different interview scenarios
  private readonly prompts = {
    algorithm: `You are a FAANG senior engineer conducting a technical interview. The candidate has presented an algorithmic problem.

RESPONSE FORMAT (follow exactly):
Category: Algorithm / DS

Problem Analysis:
- Time Complexity Target: [O(n), O(log n), etc.]
- Space Complexity Target: [O(1), O(n), etc.]
- Key Data Structures: [Array, Hash Map, Tree, etc.]
- Algorithm Pattern: [Two Pointers, Sliding Window, DFS/BFS, etc.]

Optimal Approach:
1. [Step-by-step approach]
2. [Edge cases to consider]
3. [Optimization strategies]

Sample Code:
\`\`\`[language]
[clean, well-commented code]
\`\`\`

Interview Tips:
- Ask about: [specific follow-up questions]
- Watch for: [common mistakes]
- Probe: [deeper understanding areas]

Difficulty: [Easy/Medium/Hard]
Estimated Time: [X minutes]`,

    systemDesign: `You are a FAANG senior engineer conducting a system design interview. The candidate has presented a system design question.

RESPONSE FORMAT (follow exactly):
Category: System Design

Requirements Analysis:
- Functional Requirements: [list]
- Non-Functional Requirements: [Scalability, Availability, etc.]
- Scale: [users, requests per second, data size]

High-Level Architecture:
- Components: [list main components]
- Data Flow: [how data moves through system]
- Key Technologies: [databases, caches, message queues]

Deep Dive Areas:
1. [Component 1]: [design decisions, trade-offs]
2. [Component 2]: [scaling strategies]
3. [Component 3]: [failure handling]

Interview Tips:
- Ask about: [specific design decisions]
- Challenge: [scalability scenarios]
- Probe: [trade-off understanding]

Complexity: [Low/Medium/High]
Estimated Time: [X minutes]`,

    behavioral: `You are a FAANG hiring manager conducting a behavioral interview. The candidate has shared a situation or experience.

RESPONSE FORMAT (follow exactly):
Category: Behavioral / STAR

STAR Framework Analysis:
- Situation: [context and background]
- Task: [specific responsibility or challenge]
- Action: [steps taken and decisions made]
- Result: [outcomes and learnings]

Leadership Indicators:
- [Leadership quality 1]: [evidence from response]
- [Leadership quality 2]: [evidence from response]
- Areas for Growth: [development opportunities]

Follow-up Questions:
1. [Probe deeper into specific action]
2. [Explore alternative approaches]
3. [Understand impact and scale]

Interview Tips:
- Ask for: [specific metrics or outcomes]
- Challenge: [decision-making process]
- Explore: [team dynamics and collaboration]

Strength Level: [Strong/Moderate/Needs Development]
Estimated Time: [X minutes]`,

    technical: `You are a FAANG senior engineer conducting a technical concept interview. The candidate has asked about a technical topic.

RESPONSE FORMAT (follow exactly):
Category: Technical Concept

Concept Breakdown:
- Core Definition: [clear, concise explanation]
- Key Components: [main parts or aspects]
- Real-world Applications: [practical examples]

Depth Levels:
- Basic Understanding: [fundamental concepts]
- Intermediate Knowledge: [implementation details]
- Advanced Topics: [optimization, trade-offs]

Common Misconceptions:
1. [Misconception 1]: [correct explanation]
2. [Misconception 2]: [correct explanation]

Interview Tips:
- Ask for: [specific examples or use cases]
- Challenge: [edge cases or limitations]
- Probe: [deeper technical understanding]

Knowledge Level: [Beginner/Intermediate/Advanced]
Estimated Time: [X minutes]`,

    debugging_optimization: `You are a FAANG senior engineer helping debug a technical issue. The candidate has presented a problem.

RESPONSE FORMAT (follow exactly):
Category: Debugging / Troubleshooting

Problem Analysis:
- Symptoms: [what's happening]
- Root Cause Candidates: [possible causes]
- Investigation Priority: [where to look first]

Debugging Strategy:
1. [Step 1]: [specific action]
2. [Step 2]: [specific action]
3. [Step 3]: [specific action]

Tools & Techniques:
- Logging: [what to log and where]
- Monitoring: [metrics to track]
- Testing: [how to reproduce and verify]

Interview Tips:
- Ask about: [debugging methodology]
- Challenge: [alternative approaches]
- Probe: [systematic thinking]

Complexity: [Low/Medium/High]
Estimated Time: [X minutes]`,

    general: `You are a FAANG senior engineer conducting a technical interview. Analyze the input and provide structured guidance.

RESPONSE FORMAT (follow exactly):
Category: [Most appropriate category]

Analysis:
- [Key insights about the input]
- [Relevant technical considerations]

Guidance:
- [Specific advice or approach]
- [Areas to focus on]

Next Steps:
- [Recommended follow-up actions]
- [Questions to ask]

Interview Tips:
- [Specific interview guidance]
- [Areas to probe deeper]

Relevance: [High/Medium/Low]
Estimated Time: [X minutes]`
  }

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey)
    // Optimize model configuration for faster responses
    this.model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        maxOutputTokens: 2048, // Limit response length for faster generation
        temperature: 0.7, // Slightly lower temperature for more focused responses
        topK: 40, // Limit token selection for faster processing
        topP: 0.8 // Nucleus sampling for better quality/speed balance
      }
    })
  }

  // Helper method to add timeout to API calls
  private async generateContentWithTimeout(prompt: string | (string | any)[], timeoutMs: number = 50000) {
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

  // Input validation and sanitization
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

  // AI-powered classification with combined classify+generate approach
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
          // Extract transcription from audio
          const audioPart = content as any
          const transcriptionPrompt = "Transcribe this audio clearly and completely."
          const transcriptionResult = await this.generateContentWithTimeout([transcriptionPrompt, audioPart])
          extractedText = (await transcriptionResult.response).text()
          
          if (!extractedText || extractedText.trim().length === 0) {
            throw new Error('Audio transcription failed or returned empty result')
          }
        } else if (inputType === 'image') {
          // Extract text from image using OCR
          const imagePart = content as any
          const ocrPrompt = "Extract all text from this image clearly and completely."
          const ocrResult = await this.generateContentWithTimeout([ocrPrompt, imagePart])
          extractedText = (await ocrResult.response).text()
          
          if (!extractedText || extractedText.trim().length === 0) {
            throw new Error('Image OCR failed or returned empty result')
          }
        }

        // Step 2: Dynamic classification prompt based on content length
        const isLongContent = extractedText.length > 500
        const categoryDefinitions = isLongContent ? 
          "algorithm, system_design, behavioral, technical, debugging_optimization, general" :
          `algorithm (coding problems, DSA, competitive programming), 
           system_design (architecture, scalability, distributed systems), 
           behavioral (STAR questions, experience, leadership), 
           technical (APIs, languages, frameworks, concepts), 
           debugging_optimization (code debugging, performance issues), 
           general (everything else)`

        // Step 3: Extract most category-indicative snippet for long content
        const contentSnippet = isLongContent ? 
          this.extractCategoryIndicativeSnippet(extractedText) : 
          extractedText

        // Step 4: Combined classification and response generation
        const combinedPrompt = `You are an AI interview assistant. Your task is to:

1. CLASSIFY the input into exactly one category: ${categoryDefinitions}

2. GENERATE a structured interview response using the appropriate format.

Input Type: ${inputType}
Content: ${contentSnippet}

Classification Task: Return ONLY the category name (algorithm, system_design, behavioral, technical, debugging_optimization, or general)

Response Task: Based on the classification, provide a structured interview coaching response following the exact format for that category.

Return your response in this format:
CATEGORY: [category_name]
RESPONSE: [structured_response]`

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

  // Generate fallback response when all attempts fail
  private generateFallbackResponse(inputType: 'text' | 'audio' | 'image', error: Error): string {
    const timestamp = new Date().toISOString()
    const errorInfo = error.message || 'Unknown error'
    
    return `Category: General

Analysis:
- Input processing encountered an issue
- Error: ${errorInfo}
- Timestamp: ${timestamp}

Guidance:
- Please try again with a different input or format
- Ensure your ${inputType} input is clear and complete
- Check your internet connection if the issue persists

Next Steps:
- Retry with a simpler input
- Try using a different input method (text instead of ${inputType})
- Contact support if the issue continues

Interview Tips:
- Always have a backup plan for technical difficulties
- Practice explaining problems in multiple formats
- Be prepared to adapt to unexpected situations

Relevance: Medium
Estimated Time: 5 minutes

Note: This is a fallback response due to processing difficulties. Please try again.`
  }

  // Extract most category-indicative snippet for long content
  private extractCategoryIndicativeSnippet(text: string): string {
    const words = text.split(' ')
    if (words.length <= 100) return text
    
    // Look for category-indicative keywords in the first 100 words
    const first100Words = words.slice(0, 100).join(' ')
    const categoryKeywords = {
      algorithm: ['algorithm', 'array', 'sort', 'search', 'tree', 'graph', 'leetcode', 'hackerrank', 'coding', 'problem'],
      system_design: ['system', 'design', 'architecture', 'scalability', 'database', 'microservices', 'distributed'],
      behavioral: ['experience', 'situation', 'challenge', 'team', 'leadership', 'conflict', 'achievement'],
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

  private async fileToGenerativePart(imagePath: string) {
    const imageData = await fs.promises.readFile(imagePath)
    return {
      inlineData: {
        data: imageData.toString("base64"),
        mimeType: "image/png"
      }
    }
  }

  private enforceBlankLines(text: string): string {
    // Insert a newline after each heading, even if content is on the same line
    let processed = text.replace(
      /(Category|Problem Analysis|Requirements Analysis|STAR Framework Analysis|Concept Breakdown|Problem Analysis|Analysis|Optimal Approach|High-Level Architecture|Leadership Indicators|Depth Levels|Common Misconceptions|Debugging Strategy|Tools & Techniques|Interview Tips|Difficulty|Complexity|Strength Level|Knowledge Level|Relevance|Estimated Time): ?/g,
      '$1:\n'
    );
    // Add an extra blank line between sections (if not already present)
    processed = processed.replace(
      /(Category|Problem Analysis|Requirements Analysis|STAR Framework Analysis|Concept Breakdown|Problem Analysis|Analysis|Optimal Approach|High-Level Architecture|Leadership Indicators|Depth Levels|Common Misconceptions|Debugging Strategy|Tools & Techniques|Interview Tips|Difficulty|Complexity|Strength Level|Knowledge Level|Relevance|Estimated Time):\n([\s\S]*?)(?=(Category|Problem Analysis|Requirements Analysis|STAR Framework Analysis|Concept Breakdown|Problem Analysis|Analysis|Optimal Approach|High-Level Architecture|Leadership Indicators|Depth Levels|Common Misconceptions|Debugging Strategy|Tools & Techniques|Interview Tips|Difficulty|Complexity|Strength Level|Knowledge Level|Relevance|Estimated Time):|$)/g,
      (match, heading, content) => `${heading}:\n${content.trim()}\n\n`
    );
    return processed.trim();
  }

  // Unified processing for all input types
  public async extractProblemFromImages(imagePaths: string[]) {
    const imageParts = await Promise.all(
      imagePaths.map(this.fileToGenerativePart.bind(this))
    )
    
    // Use unified processing for images
    return this.classifyAndGenerateResponse(imageParts, 'image')
  }

  public async generateSolution(problemInfo: any) {
    // For problem info, treat as text input
    const problemText = JSON.stringify(problemInfo, null, 2)
    return this.classifyAndGenerateResponse(problemText, 'text')
  }

  public async debugSolutionWithImages(problemInfo: any, currentCode: string, debugImagePaths: string[]) {
    const imageParts = await Promise.all(
      debugImagePaths.map(this.fileToGenerativePart.bind(this))
    )
    
    // Combine problem info, code, and images for debugging classification
    const combinedContent = `Problem: ${JSON.stringify(problemInfo)}\nCode: ${currentCode}\nDebug Images: [Multiple images provided]`
    return this.classifyAndGenerateResponse(combinedContent, 'text')
  }

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

  public async analyzeAudioFromBase64(data: string, mimeType: string) {
    const audioPart = { inlineData: { data, mimeType } }
    
    // Use unified processing for audio
    return this.classifyAndGenerateResponse(audioPart, 'audio')
  }

  public async analyzeImageFile(imagePath: string) {
    const imageData = await fs.promises.readFile(imagePath)
    const imagePart = { inlineData: { data: imageData.toString("base64"), mimeType: "image/png" } }
    
    // Use unified processing for images
    return this.classifyAndGenerateResponse(imagePart, 'image')
  }

  public async analyzeTextInput(text: string) {
    // Use unified processing for text
    return this.classifyAndGenerateResponse(text, 'text')
  }
}
