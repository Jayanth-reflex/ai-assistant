# AI Interview Assistant

> Professional AI-powered desktop application for real-time interview coaching, meeting assistance, and intelligent conversation support.

## Overview

The **AI Interview Assistant** is a cutting-edge desktop application that revolutionizes how you approach interviews, meetings, and professional conversations. Built with modern technologies and powered by Google's Gemini AI, it provides real-time assistance through multiple input modalities while maintaining complete privacy and local data processing.

### Key Features

- **Real-time AI Coaching**: Get instant feedback and suggestions during live conversations
- **Privacy-First**: All processing happens locally on your device
- **Fully Customizable**: Personalize the interface to match your preferences
- **Multi-Modal Input**: Screenshots, voice, and text - all processed intelligently
- **Always-On-Top**: Non-intrusive overlay that stays accessible during meetings
- **Context-Aware**: Combines visual, audio, and textual context for better responses

## Features

### Core Functionality

| Feature | Description | Hotkey |
|---------|-------------|---------|
| **Smart Screenshots** | Capture code, documents, or problems for AI analysis | `⌘ + H` |
| **Voice Transcription** | Real-time speech-to-text with Whisper AI | Click mic |
| **Text Input** | Direct text entry for immediate AI processing | Click text |
| **AI Analysis** | Multi-modal context analysis with Gemini AI | `⌘ + Enter` |
| **Session Reset** | Clear current session and start fresh | `⌘ + R` |

### Advanced Capabilities

- **Multi-Modal Intelligence**: OCR-powered text extraction, high-accuracy speech recognition, and intelligent text analysis
- **Professional Features**: Document analysis, follow-up generation, session management
- **User Experience**: Always-on-top interface, global hotkeys, real-time updates, customizable UI

## Customization

### Response Appearance

Transform your AI responses with complete visual customization:

- **Background Colors**: Choose from millions of colors or use the color picker
- **Font Colors**: Select optimal text colors for readability
- **Opacity Control**: Fine-tune transparency from 10% to 90%
- **Real-time Preview**: See changes apply instantly

### Accessing Customization
1. Click the **Settings** icon (⚙️) in the main interface
2. Navigate to the **Response Colors** section
3. Use color pickers or enter hex values
4. Adjust opacity with the slider
5. Click **Save** to apply changes

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Electron
- **AI & Backend**: Google Gemini API, OpenAI Whisper, Tesseract.js, Node.js
- **Development**: Playwright, ESLint & Prettier, Husky
- **Build**: Electron Builder, Cross-env, Concurrently

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-username/ai-interview-assistant.git
cd ai-interview-assistant
npm install
```

### 2. Launch Development Mode
```bash
npm run app:dev
```

### 3. Configure API Key
1. Open the app and click the **Settings** icon (⚙️)
2. Paste your [Google Gemini API key](https://aistudio.google.com/app/apikey)
3. Click **Save** to store securely

### 4. Start Using
- **Take a screenshot** with `⌘ + H`
- **Record voice** by clicking the microphone
- **Type questions** using the text input
- **Process** with `⌘ + Enter`

## Usage Guide

### Input Methods

#### Screenshot Capture (`⌘ + H`)
- Capture code snippets, problem statements, or documents
- Automatic OCR text extraction
- AI analysis of visual content
- Perfect for technical interviews and code reviews

#### Voice Recording
- Real-time speech-to-text conversion
- High-accuracy transcription with Whisper AI
- Support for multiple languages
- Ideal for verbal questions and responses

#### Text Input
- Direct text entry for immediate processing
- AI-powered analysis and response generation
- Quick questions and follow-ups
- Structured response formatting

### Controls & Navigation

#### Processing Commands
| Action | Shortcut | Description |
|--------|----------|-------------|
| **Process Input** | `⌘ + Enter` | Analyze current input and generate AI response |
| **Reset Session** | `⌘ + R` | Clear all data and return to home view |
| **Toggle Window** | `⌘ + B` | Show/hide the application window |

#### Window Management
| Action | Shortcut | Description |
|--------|----------|-------------|
| **Move Left** | `⌘ + ←` | Reposition window to the left |
| **Move Right** | `⌘ + →` | Reposition window to the right |
| **Move Up** | `⌘ + ↑` | Reposition window upward |
| **Move Down** | `⌘ + ↓` | Reposition window downward |

## Development

For detailed development information, see:
- [Project Architecture](docs/ARCHITECTURE.md) - Technical structure and design patterns
- [Testing Strategy](docs/TESTING.md) - Testing approach and guidelines
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run app:dev

# Build Electron backend
npm run build:electron

# Run tests
npm test
```

## Troubleshooting

### Common Issues

#### API Key Problems
```
Error: "Gemini API key not found"
Solution: 
1. Open Settings (⚙️)
2. Paste your API key
3. Click Save
4. Restart the application
```

#### Performance Issues
```
High latency (20-30 seconds)
Normal: AI processing takes time
Optimization: Reduce input size for faster responses
```

#### Color Customization
```
Colors not applying
Solution:
1. Check browser console for errors
2. Refresh the application
3. Verify preferences are saved
4. Check localStorage in DevTools
```

#### Audio Recording
```
Microphone not working
Solution:
1. Check system permissions
2. Verify microphone access
3. Restart the application
4. Check browser console for errors
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Quick Contribution Steps
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- [Google Gemini API](https://aistudio.google.com/app/apikey) - Get your API key
- [Issues](https://github.com/your-repo/issues) - Report bugs
- [Discussions](https://github.com/your-repo/discussions) - Community chat
