# 🎯 AI Interview Assistant

<div align="center">

![AI Interview Assistant](https://img.shields.io/badge/AI-Powered%20Interview%20Assistant-blue?style=for-the-badge&logo=openai)
![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows-lightgrey?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=for-the-badge&logo=typescript)

> **Professional AI-powered desktop application for real-time interview coaching, meeting assistance, and intelligent conversation support.**

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [🎨 Customization](#-customization) • [🛠️ Setup](#️-setup) • [📖 Usage](#-usage) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Overview

The **AI Interview Assistant** is a cutting-edge desktop application that revolutionizes how you approach interviews, meetings, and professional conversations. Built with modern technologies and powered by Google's Gemini AI, it provides real-time assistance through multiple input modalities while maintaining complete privacy and local data processing.

### ✨ What Makes It Special

- 🎯 **Real-time AI Coaching**: Get instant feedback and suggestions during live conversations
- 🔒 **100% Privacy-First**: All processing happens locally on your device
- 🎨 **Fully Customizable**: Personalize the interface to match your preferences
- 🚀 **Multi-Modal Input**: Screenshots, voice, and text - all processed intelligently
- ⚡ **Always-On-Top**: Non-intrusive overlay that stays accessible during meetings
- 🧠 **Context-Aware**: Combines visual, audio, and textual context for better responses

---

## 📋 Features

### 🎯 Core Functionality

| Feature | Description | Hotkey |
|---------|-------------|---------|
| **📸 Smart Screenshots** | Capture code, documents, or problems for AI analysis | `⌘ + H` |
| **🎤 Voice Transcription** | Real-time speech-to-text with Whisper AI | Click mic |
| **⌨️ Text Input** | Direct text entry for immediate AI processing | Click text |
| **🧠 AI Analysis** | Multi-modal context analysis with Gemini AI | `⌘ + Enter` |
| **🔄 Session Reset** | Clear current session and start fresh | `⌘ + R` |

### 🚀 Advanced Capabilities

#### **Multi-Modal Intelligence**
- **Visual Context**: OCR-powered text extraction from screenshots
- **Audio Processing**: High-accuracy speech recognition
- **Text Analysis**: Intelligent processing of typed questions
- **Context Fusion**: Combines all inputs for comprehensive understanding

#### **Professional Features**
- **Document Analysis**: Resume and document parsing for interview prep
- **Follow-up Generation**: Automated meeting summaries and action items
- **Session Management**: Local storage of all interactions
- **Cross-platform Support**: Seamless experience on macOS and Windows

#### **User Experience**
- **Always-on-top Interface**: Non-intrusive overlay design
- **Global Hotkeys**: Keyboard shortcuts work system-wide
- **Real-time Updates**: Instant feedback and response generation
- **Customizable UI**: Personalize colors, fonts, and opacity

---

## 🎨 Customization

### 🎨 Response Appearance

Transform your AI responses with complete visual customization:

#### **Color Customization**
- **Background Colors**: Choose from millions of colors or use the color picker
- **Font Colors**: Select optimal text colors for readability
- **Opacity Control**: Fine-tune transparency from 10% to 90%
- **Real-time Preview**: See changes apply instantly

#### **Accessing Customization**
1. Click the **⚙️ Settings** icon in the main interface
2. Navigate to the **Response Colors** section
3. Use color pickers or enter hex values
4. Adjust opacity with the slider
5. Click **Save** to apply changes

#### **Default Theme**
- **Background**: Black (`#000000`) with 50% opacity
- **Font**: Light gray (`#e5e7eb`) for optimal contrast
- **Reset**: Restore defaults anytime with the reset button

---

## 🛠️ Tech Stack

### 🎨 Frontend Technologies
- **React 18** - Modern UI framework with hooks and concurrent features
- **TypeScript** - Type-safe development with full IntelliSense support
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Electron** - Cross-platform desktop application framework

### 🤖 AI & Backend Services
- **Google Gemini API** - Advanced multimodal AI for intelligent analysis
- **OpenAI Whisper** - State-of-the-art speech-to-text transcription
- **Tesseract.js** - High-accuracy OCR for text extraction from images
- **Node.js** - Server-side JavaScript runtime for backend processing

### 🧪 Development & Quality
- **Playwright** - End-to-end testing framework for reliable automation
- **ESLint & Prettier** - Code quality and consistent formatting
- **Husky** - Git hooks for automated code quality checks
- **TypeScript** - Static type checking and enhanced developer experience

### 📦 Build & Distribution
- **Electron Builder** - Professional application packaging and distribution
- **Cross-env** - Cross-platform environment variable management
- **Concurrently** - Parallel process management for development

---

## 🚀 Quick Start

### 1️⃣ **Clone & Install**
```bash
# Clone the repository
git clone https://github.com/your-username/ai-interview-assistant.git
cd ai-interview-assistant

# Install dependencies
npm install
```

### 2️⃣ **Launch Development Mode**
```bash
# Start the application
npm run app:dev
```

### 3️⃣ **Configure API Key**
1. Open the app and click the **⚙️ Settings** icon
2. Paste your [Google Gemini API key](https://aistudio.google.com/app/apikey)
3. Click **Save** to store securely

### 4️⃣ **Start Using**
- **Take a screenshot** with `⌘ + H`
- **Record voice** by clicking the microphone
- **Type questions** using the text input
- **Process** with `⌘ + Enter`

---

## 📖 Detailed Usage Guide

### 🎯 Input Methods

#### **📸 Screenshot Capture**
```bash
Hotkey: ⌘ + H
```
- Capture code snippets, problem statements, or documents
- Automatic OCR text extraction
- AI analysis of visual content
- Perfect for technical interviews and code reviews

#### **🎤 Voice Recording**
```bash
Action: Click microphone button
```
- Real-time speech-to-text conversion
- High-accuracy transcription with Whisper AI
- Support for multiple languages
- Ideal for verbal questions and responses

#### **⌨️ Text Input**
```bash
Action: Click text input button
```
- Direct text entry for immediate processing
- AI-powered analysis and response generation
- Quick questions and follow-ups
- Structured response formatting

### 🎮 Controls & Navigation

#### **Processing Commands**
| Action | Shortcut | Description |
|--------|----------|-------------|
| **Process Input** | `⌘ + Enter` | Analyze current input and generate AI response |
| **Reset Session** | `⌘ + R` | Clear all data and return to home view |
| **Toggle Window** | `⌘ + B` | Show/hide the application window |

#### **Window Management**
| Action | Shortcut | Description |
|--------|----------|-------------|
| **Move Left** | `⌘ + ←` | Reposition window to the left |
| **Move Right** | `⌘ + →` | Reposition window to the right |
| **Move Up** | `⌘ + ↑` | Reposition window upward |
| **Move Down** | `⌘ + ↓` | Reposition window downward |

### 🎨 Customization Workflow

#### **Accessing Settings**
1. **Locate Settings**: Click the gear icon (⚙️) in the main interface
2. **Navigate Sections**: Use the organized settings layout
3. **Apply Changes**: Real-time preview of all modifications
4. **Save Preferences**: Automatic persistence across sessions

#### **Color Customization Process**
```bash
1. Open Settings (⚙️)
2. Navigate to "Response Colors"
3. Choose Background Color:
   - Use color picker for visual selection
   - Enter hex code for precise control
4. Select Font Color:
   - Ensure optimal contrast
   - Consider accessibility
5. Adjust Opacity:
   - 10% - 90% range
   - Real-time preview
6. Save Changes
```

---

## 🏗️ Project Architecture

```
ai-interview-assistant/
├── 📁 electron/                 # Electron main process
│   ├── main.ts                  # Application entry point
│   ├── ipcHandlers.ts           # IPC communication handlers
│   ├── services/                # Backend services
│   │   ├── GeminiClient.ts      # AI API integration
│   │   ├── AudioCapture.ts      # Voice recording service
│   │   ├── ScreenCapture.ts     # Screenshot functionality
│   │   └── OCRService.ts        # Text extraction service
│   └── WindowHelper.ts          # Window management
├── 📁 src/                      # React frontend
│   ├── _pages/                  # Main application pages
│   │   ├── Queue.tsx            # Main input interface
│   │   ├── Solutions.tsx        # AI response display
│   │   ├── Settings.tsx         # Configuration panel
│   │   └── Debug.tsx            # Debug information
│   ├── components/              # Reusable UI components
│   │   ├── AudioRecorder/       # Voice recording interface
│   │   ├── Queue/               # Input queue management
│   │   ├── RichResponseFormatter/ # Response formatting
│   │   └── ui/                  # Base UI components
│   ├── lib/                     # Utilities and services
│   │   ├── preferences.ts       # User preferences management
│   │   └── utils.ts             # Helper functions
│   └── types/                   # TypeScript definitions
├── 📁 renderer/                 # Renderer process
├── 📁 tests/                    # Test suites
├── 📁 worker-script/            # Background workers
└── 📄 Configuration files
```

---

## 🔧 Development Guide

### 🛠️ Development Setup

#### **Prerequisites**
- **Node.js** 18+ and npm
- **Git** for version control
- **Code editor** (VS Code recommended)

#### **Environment Setup**
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

### 🧪 Testing Strategy

#### **Test Types**
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API and service testing
- **E2E Tests**: Full application workflow testing
- **Performance Tests**: Load and response time testing

#### **Running Tests**
```bash
# Run all tests
npm test

# Run specific test suite
npm run test:e2e

# Run with coverage
npm run test:coverage
```

### 📦 Building & Distribution

#### **Development Build**
```bash
# Build for development
npm run build:dev

# Build for production
npm run build:prod
```

#### **Distribution**
```bash
# Package for macOS
npm run dist:mac

# Package for Windows
npm run dist:win

# Package for all platforms
npm run dist:all
```

---

## 🆘 Troubleshooting

### 🔍 Common Issues

#### **API Key Problems**
```bash
❌ Error: "Gemini API key not found"
✅ Solution: 
1. Open Settings (⚙️)
2. Paste your API key
3. Click Save
4. Restart the application
```

#### **Performance Issues**
```bash
❌ High latency (20-30 seconds)
✅ Normal: AI processing takes time
✅ Optimization: Reduce input size for faster responses
```

#### **Color Customization**
```bash
❌ Colors not applying
✅ Solution:
1. Check browser console for errors
2. Refresh the application
3. Verify preferences are saved
4. Check localStorage in DevTools
```

#### **Audio Recording**
```bash
❌ Microphone not working
✅ Solution:
1. Check system permissions
2. Verify microphone access
3. Restart the application
4. Check browser console for errors
```

### 🐛 Debug Mode

#### **Enable Debug Logging**
```bash
# Development mode automatically includes debug logs
npm run app:dev

# Check console for detailed information
# Look for preference changes and API calls
```

#### **Common Debug Commands**
```bash
# Check preferences
preferencesManager.debugPreferences()

# Verify API connection
# Check network tab for API calls

# Monitor localStorage
# Check Application tab in DevTools
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🎯 Contribution Areas

#### **High Priority**
- 🐛 **Bug Fixes**: Improve stability and reliability
- 📱 **UI/UX**: Enhance user experience and accessibility
- 🚀 **Performance**: Optimize speed and resource usage
- 🧪 **Testing**: Add comprehensive test coverage

#### **Medium Priority**
- 🌍 **Internationalization**: Add multi-language support
- 🎨 **Themes**: Create additional color schemes
- 📊 **Analytics**: Add usage statistics (privacy-focused)
- 🔌 **Plugins**: Extend functionality with plugins

#### **Low Priority**
- 📚 **Documentation**: Improve guides and examples
- 🎬 **Demos**: Create showcase videos and tutorials
- 🌐 **Website**: Develop project landing page
- 📦 **Packaging**: Optimize distribution packages

### 📋 Contribution Guidelines

#### **Code Standards**
- **TypeScript**: 100% type coverage required
- **ESLint**: Follow project linting rules
- **Prettier**: Maintain consistent formatting
- **Tests**: Add tests for new features

#### **Commit Convention**
```bash
feat: add new color customization feature
fix: resolve microphone permission issue
docs: update README with usage examples
test: add unit tests for preferences manager
refactor: improve API error handling
```

#### **Pull Request Process**
1. **Fork** the repository
2. **Create** a feature branch
3. **Develop** your changes
4. **Test** thoroughly
5. **Submit** a pull request
6. **Review** and iterate

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### 📜 License Summary
- ✅ **Commercial Use**: Allowed
- ✅ **Modification**: Allowed
- ✅ **Distribution**: Allowed
- ✅ **Private Use**: Allowed
- ⚠️ **Liability**: Limited
- ⚠️ **Warranty**: None

---

## 🌐 Links & Resources

### 🔗 Official Links
- **🔑 [Google Gemini API](https://aistudio.google.com/app/apikey)** - Get your API key
- **📖 [Documentation](https://github.com/your-repo/wiki)** - Detailed guides
- **🐛 [Issues](https://github.com/your-repo/issues)** - Report bugs
- **💬 [Discussions](https://github.com/your-repo/discussions)** - Community chat

### 📚 Additional Resources
- **🎥 [Demo Video](https://youtube.com/watch?v=example)** - See it in action
- **📊 [Roadmap](https://github.com/your-repo/projects)** - Future plans
- **🤝 [Contributing Guide](CONTRIBUTING.md)** - How to help
- **📋 [Changelog](CHANGELOG.md)** - Version history

---

## 🙏 Acknowledgments

### 🏆 Special Thanks
- **Google Gemini Team** - For the incredible AI capabilities
- **OpenAI** - For the Whisper speech recognition
- **Electron Community** - For the amazing desktop framework
- **React Team** - For the powerful UI library

### 🌟 Contributors
Thanks to all the amazing contributors who have helped make this project better!

[![Contributors](https://contrib.rocks/image?repo=your-username/ai-interview-assistant)](https://github.com/your-username/ai-interview-assistant/graphs/contributors)

---

<div align="center">

**Made by Jayanth aka Reflex**

[⭐ Star this repo](https://github.com/your-username/ai-interview-assistant) • [🐛 Report an issue](https://github.com/your-username/ai-interview-assistant/issues) • [📖 View documentation](https://github.com/your-username/ai-interview-assistant/wiki)

</div>
