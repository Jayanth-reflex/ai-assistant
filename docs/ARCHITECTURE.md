# Architecture Documentation

## Overview

The UAT AI Meetings Assistant is an Electron-based application that provides intelligent interview coaching through AI-powered analysis of multiple input types. The application uses Google's Gemini LLM API to process screenshots, audio recordings, and text inputs, delivering structured, categorized responses for technical interview preparation.

## Core Architecture

### 1. Main Process (Electron)
- **Entry Point**: `electron/main.ts`
- **State Management**: `electron/AppState.ts`
- **Processing Engine**: `electron/ProcessingHelper.ts`
- **AI Integration**: `electron/LLMHelper.ts`

### 2. Renderer Process (React)
- **UI Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks with Electron IPC

## Key Components

### LLMHelper - AI Processing Engine
The `LLMHelper` class is the core AI processing engine that handles all interactions with the Gemini LLM API.

**Key Features:**
- **Unified Processing Pipeline**: Single method handles text, audio, and image inputs
- **Intelligent Categorization**: Automatically classifies inputs into algorithm, technical, debugging, or general categories
- **Optimized Prompts**: Specialized prompt templates for each category with structured response formats
- **Robust Error Handling**: Comprehensive fallback mechanisms and retry logic
- **Timeout Protection**: Prevents hanging requests with configurable timeouts

**Processing Flow:**
1. **Input Validation**: Validates and sanitizes all inputs
2. **Content Extraction**: Extracts text from audio (transcription) and images (OCR)
3. **Dynamic Classification**: Uses AI to categorize content based on keywords and patterns
4. **Structured Response**: Applies category-specific prompts for consistent output
5. **Format Enforcement**: Ensures proper spacing and removes unwanted sections

### ProcessingHelper - Orchestration Engine
The `ProcessingHelper` class manages the complete processing pipeline and coordinates between different input types.

**Key Features:**
- **World-Class Multi-Image Processing**: Combines multiple screenshots into a single coherent problem analysis
- **Mixed Input Handling**: Intelligently combines text, audio, and image inputs
- **Queue Management**: Processes input queues with proper error handling
- **Debug Mode**: Supports iterative problem solving with additional screenshots
- **Audio-Only Input Support**: Dedicated processing path for audio-only inputs

**Processing Modes:**
1. **Queue Mode**: Initial processing of input queues
2. **Debug Mode**: Iterative improvement using additional screenshots

### ScreenshotHelper - Image Management
Handles screenshot capture, storage, and queue management with JPEG optimization.

**Features:**
- **JPEG Conversion**: Reduces file sizes without quality loss using Sharp library
- **Queue Management**: Maintains separate queues for initial and debug screenshots
- **File Organization**: Structured storage in user data directory

### AudioCapture - Audio Processing
Manages audio recording and processing with real-time transcription capabilities.

**Features:**
- **Real-time Recording**: Captures audio with configurable quality settings
- **Base64 Processing**: Supports both file and inline audio processing
- **Transcription**: Uses LLM for high-quality audio-to-text conversion

## Data Flow

### 1. Input Processing
```
User Input → File System → ProcessingHelper → LLMHelper → Gemini API → Structured Response
```

### 2. Multi-Image Processing
```
Multiple Screenshots → Combined Analysis → Single Coherent Problem → Structured Solution
```

### 3. Audio Processing
```
Audio Recording → Transcription → Categorization → Structured Response
```

### 4. Text Processing
```
Text Input → Direct Categorization → Structured Response
```

## State Management

### AppState
Central state management for the Electron main process:
- **Window Management**: Main window and view state
- **Queue Management**: Screenshot and processing queues
- **Problem State**: Current problem information and debug state
- **Event Coordination**: IPC event handling and coordination

### React State
Component-level state management in the renderer process:
- **UI State**: View transitions and component states
- **Form Data**: User input and configuration
- **Real-time Updates**: Live updates from main process

## IPC Communication

### Main Process → Renderer
- `PROCESSING_EVENTS`: Processing status and results
- `QUEUE_UPDATES`: Screenshot queue changes
- `ERROR_EVENTS`: Error notifications

### Renderer → Main Process
- `PROCESS_SCREENSHOTS`: Trigger processing
- `CAPTURE_SCREENSHOT`: Take new screenshots
- `CANCEL_REQUESTS`: Cancel ongoing operations

## Error Handling

### Multi-Layer Error Handling
1. **Input Validation**: Prevents invalid inputs from reaching processing
2. **API Timeouts**: Prevents hanging requests
3. **Retry Logic**: Exponential backoff for transient failures
4. **Fallback Responses**: Graceful degradation with helpful error messages
5. **User Feedback**: Clear error messages and recovery suggestions

### Error Recovery
- **Automatic Retries**: Up to 3 attempts with exponential backoff
- **Category Fallback**: Falls back to 'general' category if classification fails
- **Partial Success**: Continues processing even if some inputs fail
- **User Guidance**: Provides specific recovery steps for different error types

## Performance Optimizations

### 1. Image Processing
- **JPEG Conversion**: Reduces file sizes by ~70% without quality loss
- **Batch Processing**: Processes multiple images in parallel
- **Lazy Loading**: Loads images only when needed

### 2. LLM Optimization
- **Model Configuration**: Optimized for speed vs. quality balance
- **Token Limits**: Controlled response lengths for faster generation
- **Caching**: Reuses LLM instances across requests

### 3. UI Responsiveness
- **Non-blocking Operations**: All processing happens in background
- **Progress Indicators**: Real-time feedback during processing
- **Cancellation Support**: Users can interrupt long operations

## Security Considerations

### 1. API Key Management
- **Secure Storage**: API keys stored in user data directory
- **No Hardcoding**: Keys never embedded in source code
- **User Control**: Users manage their own API keys

### 2. Data Privacy
- **Local Processing**: All processing happens locally
- **No Data Retention**: Temporary files cleaned up after processing
- **User Control**: Users control what data is processed

### 3. Input Validation
- **Type Checking**: Strict validation of all inputs
- **Size Limits**: Prevents oversized inputs from causing issues
- **Sanitization**: Cleans inputs before processing

## Configuration

### Environment Variables
- `NODE_ENV`: Development/production mode
- `MOCK_API_WAIT_TIME`: Mock processing delay for testing

### User Configuration
- **API Key**: Gemini API key stored in user data
- **Processing Settings**: Configurable timeouts and retry limits
- **UI Preferences**: View states and window positions

## Testing Strategy

### 1. Unit Tests
- **LLMHelper**: Test individual processing methods
- **ProcessingHelper**: Test orchestration logic
- **Input Validation**: Test error handling and edge cases

### 2. Integration Tests
- **End-to-End**: Complete processing workflows
- **IPC Communication**: Main-renderer communication
- **File Operations**: Screenshot and audio processing

### 3. Performance Tests
- **Processing Speed**: Measure response times
- **Memory Usage**: Monitor resource consumption
- **Concurrent Operations**: Test multiple simultaneous requests

## Future Enhancements

### 1. Advanced AI Features
- **Multi-modal Analysis**: Enhanced image and audio understanding
- **Context Awareness**: Better understanding of interview context
- **Personalization**: User-specific response adaptation

### 2. Performance Improvements
- **Streaming Responses**: Real-time response generation
- **Background Processing**: Continuous analysis in background
- **Caching**: Intelligent response caching

### 3. User Experience
- **Real-time Collaboration**: Multi-user interview sessions
- **Advanced Analytics**: Detailed performance insights
- **Custom Prompts**: User-defined prompt templates

## Recent Bug Fixes & Best Practices

### Screenshot Input Category Classification
A bug was identified where screenshot inputs were misclassified due to incorrect line numbering during OCR and prompt generation. This has been resolved. The classification logic now ensures accurate detection of problem categories for all input types.

### Environment Cleanup
To maintain optimal performance and prevent stale data issues, always perform environment cleanup after sessions. Temporary files and screenshots are automatically deleted, but manual cleanup (via Cmd+R or provided scripts) is recommended for development and debugging. 