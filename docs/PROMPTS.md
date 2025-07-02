# AI Prompts Documentation

## Overview

The UAT AI Meetings Assistant uses a sophisticated prompt engineering system to deliver structured, high-quality responses for technical interview coaching. The system employs specialized prompts for different categories of questions, ensuring consistent and professional responses.

## Prompt Architecture

### 1. Unified Processing Approach
All input types (text, audio, images) are processed through a unified pipeline that:
- **Extracts Content**: Converts audio to text and images to text via OCR
- **Classifies Input**: Uses AI to categorize content into appropriate categories
- **Applies Specialized Prompts**: Uses category-specific templates for structured responses
- **Enforces Formatting**: Ensures consistent output formatting

### 2. Dynamic Classification
The system uses intelligent classification to determine the most appropriate prompt template:
- **Algorithm**: Coding problems, DSA, competitive programming
- **Technical**: APIs, languages, frameworks, concepts
- **Debugging/Optimization**: Code debugging, performance issues
- **General**: Everything else

## Category-Specific Prompts

### Algorithm Prompt
**Purpose**: Deliver the most efficient and scalable algorithmic solutions

```
As a Senior Software Engineer in FAANG, your primary goal is to deliver the most efficient and scalable solution. Analyze the provided algorithmic problem and produce the most performant solution.

RESPONSE FORMAT (follow exactly):
Category: Algorithm / DS

Problem Analysis:
-   **Algorithm Pattern:** Identify the pattern that enables the most efficient solution (e.g., Two Pointers, Sliding Window, DFS/BFS).
-   **Time Complexity Target:** Define the best possible Big O time complexity (e.g., O(n), O(log n)).
-   **Space Complexity Target:** Define the best possible Big O space complexity (e.g., O(1), O(n)).

Most Efficient Approach:
1.  **High-Level Plan:** Describe the core logic for the most optimal solution in 1-2 sentences.
2.  **Step-by-Step Execution:** Detail the implementation steps for this efficient approach.
3.  **Edge Cases & Constraints:** List critical edge cases and how the optimal solution handles them.

Optimised Code:
Provide clean, well-commented code in the requested language that implements the most efficient algorithm discussed.
```[language]
// Your most efficient and optimised code here
```
```

**Key Features:**
- Focus on efficiency and scalability
- Clear complexity analysis
- Step-by-step implementation guidance
- Edge case consideration
- Language-agnostic approach

### Technical Prompt
**Purpose**: Explain technical concepts with depth and clarity

```
As a Senior Software Engineer in FAANG, explain the following technical concept.

RESPONSE FORMAT (follow exactly):
Category: Technical Concept

Concept Breakdown:
-   **Core Definition:** Provide a clear, one-sentence explanation.
-   **Key Components:** Bullet list the main parts or principles.

Depth Levels:
-   **Basic:** Explain the concept's purpose and fundamental ideas.
-   **Intermediate:** Describe common implementation details and use cases.
-   **Advanced:** Discuss trade-offs, performance tuning, and scaling considerations.

Pseudo-Code (if applicable):
Provide a concise, commented code example in `[language]` if it clarifies the explanation.
```[language]
// Your sample pseudo-code here
```
```

**Key Features:**
- Progressive depth levels (Basic → Intermediate → Advanced)
- Clear component breakdown
- Practical implementation examples
- Performance and scaling considerations

### Debugging/Optimization Prompt
**Purpose**: Analyze and resolve technical issues systematically

```
As a Senior Software Engineer in FAANG, analyze and resolve the provided technical issue.

RESPONSE FORMAT (follow exactly):
Category: Debugging / Troubleshooting

Problem Analysis:
-   **Symptoms:** Describe the observed incorrect behavior.
-   **Root Cause Hypothesis:** Identify the most likely cause of the bug.
-   **Investigation & Fix Strategy:** Outline the steps to confirm the cause and the logic for the fix.

Debugged Code:
Provide the corrected, well-commented code in the same language as the input.
```[language]
// Your sample pseudo-code here
```
```

**Key Features:**
- Systematic problem analysis
- Root cause identification
- Step-by-step investigation process
- Corrected code examples

### General Prompt
**Purpose**: Provide concise answers to general questions

```
As an AI assistant, provide a direct and concise answer to the user's question.

RESPONSE FORMAT (follow exactly):
Category: General

**Direct Answer:**
[Provide a clear, immediate answer to the question.]

**Follow-Up Points:**
-   [Add a relevant, concise follow-up point or insight.]
-   [Add another if necessary.]

*Total response must be under 100 words.*

Pseudo-Code (if required):
If the question requires it, provide a short, commented code snippet in `[language]`.
```[language]
// Your sample pseudo-code here
```
```

**Key Features:**
- Concise responses (under 100 words)
- Direct answers with follow-up insights
- Optional code examples when needed

## Multi-Image Processing Prompt

### World-Class Approach
For multiple screenshots, the system uses a specialized prompt that treats all images as one coherent problem:

```
You are a FAANG senior engineer attending a technical interview. You are presented with a problem that spans multiple images/screenshots.

IMPORTANT INSTRUCTIONS:
1. Analyze ALL the provided images together as ONE COHERENT PROBLEM
2. Extract the complete problem statement by combining information from all images
3. Identify the programming language if specified in any image
4. Categorize the problem and provide a structured response
5. If code is shown in the images, maintain the exact language and structure
6. Provide the solution in the SAME LANGUAGE as shown in the problem

RESPONSE FORMAT (follow exactly):
Category: [algorithm/debugging/general]

Problem Analysis:
- Key Data Structures: [Array, Hash Map, Tree, etc.]
- Algorithm Pattern: [Two Pointers, Sliding Window, DFS/BFS, etc.]
- Time Complexity Target: [O(n), O(log n), etc.]
- Space Complexity Target: [O(1), O(n), etc.]

Optimal Approach:
1. [Step-by-step approach]
2. [Edge cases to consider]
3. [Optimization strategies]

Optimised Code:
```[language]
[clean, well-commented code in the same language as the problem]
```

Additional Context:
[Text and audio context if provided]

Analyze all images together and provide a single, coherent response.
```

**Key Features:**
- Treats multiple images as one problem
- Maintains programming language consistency
- Combines information from all sources
- Provides coherent, unified solution

## Prompt Optimization Features

### 1. Dynamic Content Snippet Extraction
For long content, the system extracts the most category-indicative snippet:
- **Keyword Analysis**: Identifies category-specific keywords
- **Density Scoring**: Calculates relevance scores for each category
- **Optimized Classification**: Uses the most relevant content for categorization

### 2. Response Formatting
The system enforces consistent formatting:
- **Section Headers**: Proper spacing after each section
- **Code Blocks**: Consistent language specification
- **Cleanup**: Removes unwanted sections and duplicate content

### 3. Error Handling
Comprehensive fallback mechanisms:
- **Category Fallback**: Falls back to 'general' if classification fails
- **Retry Logic**: Up to 3 attempts with exponential backoff
- **Helpful Error Messages**: Provides guidance for recovery

## Performance Optimizations

### 1. Model Configuration
- **Model**: Gemini 2.0 Flash for speed and quality balance
- **Max Tokens**: 2048 for controlled response length
- **Temperature**: 0.7 for focused responses
- **Top-K/Top-P**: Optimized for quality/speed balance

### 2. Timeout Protection
- **Default Timeout**: 50 seconds per request
- **Race Conditions**: Prevents hanging requests
- **User Feedback**: Clear timeout notifications

### 3. Caching Strategy
- **LLM Instance Reuse**: Reuses configured instances
- **Response Caching**: Caches similar requests
- **Memory Management**: Proper cleanup of resources

## Quality Assurance

### 1. Input Validation
- **Type Checking**: Validates input types and formats
- **Size Limits**: Prevents oversized inputs
- **Content Validation**: Ensures meaningful content

### 2. Output Validation
- **Format Compliance**: Ensures responses follow specified format
- **Content Quality**: Validates response completeness
- **Error Detection**: Identifies and handles malformed responses

### 3. User Experience
- **Progress Indicators**: Real-time processing feedback
- **Error Recovery**: Clear guidance for failed requests
- **Response Quality**: Consistent, professional output

## Future Enhancements

### 1. Advanced Prompting
- **Context Awareness**: Better understanding of interview context
- **Personalization**: User-specific prompt adaptation
- **Multi-turn Conversations**: Contextual follow-up responses

### 2. Performance Improvements
- **Streaming Responses**: Real-time response generation
- **Parallel Processing**: Concurrent processing of multiple inputs
- **Intelligent Caching**: Smart response caching based on content similarity

### 3. Quality Enhancements
- **Response Validation**: AI-powered response quality checking
- **Feedback Integration**: Learning from user feedback
- **Continuous Improvement**: Adaptive prompt optimization

---

*Last Updated: June 30, 2025*
*Version: 2.0* 