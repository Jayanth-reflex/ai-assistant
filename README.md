# UAT AI Meetings Assistant

A sophisticated Electron-based AI interview coaching assistant that provides intelligent, structured responses for technical interview preparation. Built with React, TypeScript, and Google's Gemini LLM API.

## 🚀 Features

### 🤖 AI-Powered Processing
- **Unified Processing Pipeline**: Seamlessly handles text, audio, and image inputs through a single, intelligent system
- **Intelligent Categorization**: Automatically classifies inputs into algorithm, technical, debugging, or general categories
- **Structured Responses**: Delivers consistent, professional responses with optimized prompts for each category
- **Multi-Image Analysis**: World-class approach that treats multiple screenshots as one coherent problem

### 📸 Screenshot Processing
- **JPEG Optimization**: Reduces file sizes by ~70% without quality loss using Sharp library
- **Multi-Image Support**: Combines multiple screenshots into unified problem analysis
- **Language Preservation**: Maintains exact programming language and structure from source images
- **Queue Management**: Efficient handling of multiple screenshots with proper organization

### 🎤 Audio Processing
- **Real-time Recording**: High-quality audio capture with configurable settings
- **LLM Transcription**: Advanced audio-to-text conversion using Gemini API
- **Audio-Only Support**: Dedicated processing path for audio-only inputs
- **Base64 Processing**: Supports both file and inline audio processing

### 📝 Text Processing
- **Direct LLM Integration**: Immediate processing of text inputs through AI
- **Smart Categorization**: Intelligent classification based on content analysis
- **Structured Output**: Consistent formatting with category-specific templates
- **Error Recovery**: Robust fallback mechanisms for failed processing

### 🔧 Technical Features
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Always-on-Top**: Stays visible during interviews with transparent background
- **Global Hotkeys**: Keyboard shortcuts for quick access
- **Error Handling**: Comprehensive error recovery with user guidance
- **Performance Optimized**: Fast processing with timeout protection

## 🏗️ Architecture

### Core Components
- **LLMHelper**: AI processing engine with unified pipeline for all input types
- **ProcessingHelper**: Orchestration engine managing the complete processing workflow
- **ScreenshotHelper**: Image management with JPEG optimization and queue handling
- **AudioCapture**: Audio recording and processing with real-time capabilities

### Processing Flow
1. **Input Reception**: Accepts screenshots, audio, or text inputs
2. **Content Extraction**: Converts audio to text and images to text via OCR
3. **Intelligent Classification**: Uses AI to categorize content appropriately
4. **Specialized Processing**: Applies category-specific prompts for structured responses
5. **Format Enforcement**: Ensures consistent, professional output formatting

### Multi-Image Processing
The system uses a world-class approach that:
- Analyzes all images together as one coherent problem
- Maintains programming language consistency
- Combines information from all sources intelligently
- Provides unified, structured solutions

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd UAT-ai-meetings-assistant

# Install dependencies
npm install

# Set up your Gemini API key in the app settings
# The app will guide you through this process on first launch

# Start development server
npm run app:dev

# Build for production
npm run build
npm run app:dist
```

## 📖 Usage

### Basic Workflow
1. **Launch the app** and configure your Gemini API key in Settings
2. **Take screenshots** of interview problems using the global hotkey (Ctrl/Cmd + Shift + S)
3. **Record audio** questions or explanations using the audio recorder
4. **Add text** inputs for additional context or questions
5. **Process inputs** to receive structured, AI-powered responses
6. **Use debug mode** for iterative problem solving with additional screenshots

### Input Types
- **Screenshots**: Capture coding problems, diagrams, or any visual content
- **Audio**: Record questions, explanations, or verbal problem descriptions
- **Text**: Type questions, code snippets, or additional context

### Response Categories
- **Algorithm**: Efficient solutions for coding problems and DSA questions
- **Technical**: Explanations of concepts, frameworks, and technologies
- **Debugging**: Systematic analysis and resolution of technical issues
- **General**: Concise answers to miscellaneous technical questions

## 🔧 Configuration

### API Key Setup
1. Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open the app and go to Settings
3. Enter your API key in the configuration panel
4. The key is stored securely in your local user data directory

### Performance Settings
- **Timeout**: Configurable request timeouts (default: 50 seconds)
- **Retry Logic**: Automatic retry with exponential backoff
- **Model Configuration**: Optimized for speed vs. quality balance

## 🧪 Testing

### Development Testing
```bash
# Run unit tests
npm test

# Run end-to-end tests
npm run test:e2e

# Run specific test suites
npm run test:unit
npm run test:integration
```

### Manual Testing
- Test all input types (screenshots, audio, text)
- Verify error handling and recovery
- Check performance with large inputs
- Validate cross-platform compatibility

## 📚 Documentation

### Architecture
- [Architecture Overview](docs/ARCHITECTURE.md) - Detailed system architecture
- [Prompt System](docs/PROMPTS.md) - AI prompt engineering and optimization
- [Commenting Progress](docs/COMMENTING_PROGRESS.md) - Code documentation status

### Technical Details
- [Performance Optimization](docs/PERFORMANCE_OPTIMIZATION.md) - Performance strategies
- [Technical Limitations](docs/TECHNICAL_LIMITATIONS_SOLUTIONS.md) - Known issues and solutions
- [Testing Strategy](docs/TESTING.md) - Testing approach and coverage

## 🚀 Recent Updates

### v1.0.0 - Major Release
- ✅ **Unified Processing Pipeline**: Single system handles all input types
- ✅ **Audio-Only Input Fix**: Dedicated processing path for audio-only inputs
- ✅ **World-Class Multi-Image Processing**: Coherent analysis of multiple screenshots
- ✅ **Optimized Prompts**: Streamlined, category-specific response templates
- ✅ **JPEG Optimization**: 70% file size reduction without quality loss
- ✅ **Comprehensive Documentation**: Complete architecture and API documentation
- ✅ **Error Recovery**: Robust fallback mechanisms and user guidance
- ✅ **Performance Optimization**: Fast processing with timeout protection

### Key Improvements
- **Algorithm Prompt**: Enhanced focus on efficiency and scalability
- **Error Handling**: Multi-layer error recovery with helpful user guidance
- **Code Quality**: Comprehensive commenting and documentation
- **User Experience**: Improved feedback and progress indicators

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes with comprehensive tests
4. Update documentation as needed
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Add comprehensive comments for new code
- Include tests for new features
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini API** for powerful AI capabilities
- **Electron** for cross-platform desktop application framework
- **React** for modern UI development
- **Sharp** for efficient image processing
- **Tailwind CSS** for beautiful, responsive styling

## 📞 Support

For support, questions, or feature requests:
- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Review the troubleshooting guide for known issues

## Known Issues & Important Notes

### Screenshot Input Category Classification
- There was a recent issue where screenshot input category classification was incorrect due to a bug in line numbering logic. This affected the accuracy of problem type detection for image-based inputs. The bug has been identified and fixed. Please refer to the technical documentation for details.

### Environment Cleanup
- For best results, always start with a clean environment. Temporary files, screenshots, and session data should be cleared regularly. Use the provided cleanup scripts or the in-app reset functionality (Cmd+R) to avoid stale data issues.

---

**Built with ❤️ for technical interview preparation**
