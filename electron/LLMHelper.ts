import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai"
import fs from "fs"

export class LLMHelper {
  private model: GenerativeModel
  
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

    technicalConcept: `You are a FAANG senior engineer conducting a technical concept interview. The candidate has asked about a technical topic.

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

    debugging: `You are a FAANG senior engineer helping debug a technical issue. The candidate has presented a problem.

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

    default: `You are a FAANG senior engineer conducting a technical interview. Analyze the input and provide structured guidance.

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
    this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
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

  private selectPrompt(content: string): string {
    const lowerContent = content.toLowerCase()
    
    // Algorithm/DS patterns
    if (lowerContent.includes('algorithm') || lowerContent.includes('data structure') || 
        lowerContent.includes('sort') || lowerContent.includes('search') || 
        lowerContent.includes('array') || lowerContent.includes('tree') || 
        lowerContent.includes('graph') || lowerContent.includes('dynamic programming') ||
        lowerContent.includes('leetcode') || lowerContent.includes('coding problem')) {
      return this.prompts.algorithm
    }
    
    // System Design patterns
    if (lowerContent.includes('system design') || lowerContent.includes('architecture') ||
        lowerContent.includes('scalability') || lowerContent.includes('microservices') ||
        lowerContent.includes('database design') || lowerContent.includes('api design') ||
        lowerContent.includes('distributed system') || lowerContent.includes('load balancer')) {
      return this.prompts.systemDesign
    }
    
    // Behavioral patterns
    if (lowerContent.includes('experience') || lowerContent.includes('situation') ||
        lowerContent.includes('challenge') || lowerContent.includes('team') ||
        lowerContent.includes('leadership') || lowerContent.includes('conflict') ||
        lowerContent.includes('achievement') || lowerContent.includes('failure') ||
        lowerContent.includes('tell me about') || lowerContent.includes('how did you')) {
      return this.prompts.behavioral
    }
    
    // Technical Concept patterns
    if (lowerContent.includes('what is') || lowerContent.includes('explain') ||
        lowerContent.includes('difference between') || lowerContent.includes('how does') ||
        lowerContent.includes('concept') || lowerContent.includes('technology') ||
        lowerContent.includes('framework') || lowerContent.includes('protocol') ||
        lowerContent.includes('jvm') || lowerContent.includes('jre') || 
        lowerContent.includes('java') || lowerContent.includes('python') ||
        lowerContent.includes('javascript') || lowerContent.includes('react') ||
        lowerContent.includes('docker') || lowerContent.includes('kubernetes')) {
      return this.prompts.technicalConcept
    }
    
    // Debugging patterns
    if (lowerContent.includes('error') || lowerContent.includes('bug') ||
        lowerContent.includes('debug') || lowerContent.includes('troubleshoot') ||
        lowerContent.includes('fix') || lowerContent.includes('issue') ||
        lowerContent.includes('problem') || lowerContent.includes('not working')) {
      return this.prompts.debugging
    }
    
    // Default to general prompt
    return this.prompts.default
  }

  public async extractProblemFromImages(imagePaths: string[]) {
    const imageParts = await Promise.all(
      imagePaths.map(this.fileToGenerativePart.bind(this))
    )
    
    // First, get a basic description to determine the prompt type
    const basicPrompt = "Describe what you see in these images in detail."
    const basicResult = await this.model.generateContent([basicPrompt, ...imageParts] as (string | any)[])
    const description = (await basicResult.response).text()
    
    // Select appropriate prompt based on content
    const selectedPrompt = this.selectPrompt(description)
    const prompt = `${selectedPrompt}\n\n` +
      `If there is a coding question or task in these images, extract it and follow the instructions above. ` +
      `Return ONLY the structured response in the specified format.`

    const result = await this.model.generateContent([prompt, ...imageParts] as (string | any)[])
    const text = this.enforceBlankLines((await result.response).text())
    return { text, timestamp: Date.now() }
  }

  public async generateSolution(problemInfo: any) {
    // Select appropriate prompt based on problem content
    const problemText = JSON.stringify(problemInfo, null, 2)
    const selectedPrompt = this.selectPrompt(problemText)
    
    const prompt = `${selectedPrompt}\n\n` +
      `Given this problem:\n${problemText}\n\n` +
      `Follow the instructions above and return ONLY the structured response in the specified format.`
    const result = await this.model.generateContent(prompt)
    const text = this.enforceBlankLines((await result.response).text())
    return { text, timestamp: Date.now() }
  }

  public async debugSolutionWithImages(problemInfo: any, currentCode: string, debugImagePaths: string[]) {
    const imageParts = await Promise.all(
      debugImagePaths.map(this.fileToGenerativePart.bind(this))
    )
    const prompt = `${this.prompts.debugging}\n\n` +
      `Context:\n1. Problem: ${JSON.stringify(problemInfo)}\n` +
      `2. Code: ${currentCode}\n3. Debug images\n\n` +
      `Extract, analyze, and return ONLY the structured response in the specified format.`

    const result = await this.model.generateContent([prompt, ...imageParts] as (string | any)[])
    const text = this.enforceBlankLines((await result.response).text())
    return { text, timestamp: Date.now() }
  }

  public async analyzeAudioFile(audioPath: string) {
    const audioData = await fs.promises.readFile(audioPath)
    const audioPart = {
      inlineData: {
        data: audioData.toString("base64"),
        mimeType: "audio/mp3"
      }
    }
    
    // First, get a basic transcription to determine the prompt type
    const basicPrompt = "Transcribe this audio and provide a brief summary of the content."
    const basicResult = await this.model.generateContent([basicPrompt, audioPart])
    const transcription = (await basicResult.response).text()
    
    // Select appropriate prompt based on content
    const selectedPrompt = this.selectPrompt(transcription)
    const prompt = `${selectedPrompt}\n\nAnalyze this audio input and provide structured interview coaching.`
    
    const result = await this.model.generateContent([prompt, audioPart])
    return { text: (await result.response).text(), timestamp: Date.now() }
  }

  public async analyzeAudioFromBase64(data: string, mimeType: string) {
    const audioPart = { inlineData: { data, mimeType } }
    
    // First, get a basic transcription to determine the prompt type
    const basicPrompt = "Transcribe this audio and provide a brief summary of the content."
    const basicResult = await this.model.generateContent([basicPrompt, audioPart])
    const transcription = (await basicResult.response).text()
    
    // Select appropriate prompt based on content
    const selectedPrompt = this.selectPrompt(transcription)
    const prompt = `${selectedPrompt}\n\nAnalyze this audio input and provide structured interview coaching.`
    
    const result = await this.model.generateContent([prompt, audioPart])
    return { text: (await result.response).text(), timestamp: Date.now() }
  }

  public async analyzeImageFile(imagePath: string) {
    const imageData = await fs.promises.readFile(imagePath)
    const imagePart = { inlineData: { data: imageData.toString("base64"), mimeType: "image/png" } }
    
    // First, get a basic description to determine the prompt type
    const basicPrompt = "Describe what you see in this image in detail."
    const basicResult = await this.model.generateContent([basicPrompt, imagePart])
    const description = (await basicResult.response).text()
    
    // Select appropriate prompt based on content
    const selectedPrompt = this.selectPrompt(description)
    const prompt = `${selectedPrompt}\n\nAnalyze this image and provide structured interview coaching.`
    
    const result = await this.model.generateContent([prompt, imagePart])
    return { text: (await result.response).text(), timestamp: Date.now() }
  }

  public async analyzeTextInput(text: string) {
    // Select appropriate prompt based on content
    const selectedPrompt = this.selectPrompt(text)
    const prompt = `${selectedPrompt}\n\nAnalyze this text input and provide structured interview coaching.`
    const result = await this.model.generateContent([prompt, text])
    return { text: (await result.response).text(), timestamp: Date.now() }
  }
}
