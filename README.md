# AI Meetings Assistant

A sophisticated Electron-based application that provides real-time, AI-driven coaching for technical interviews. Built with cutting-edge LLM technology, advanced image processing, and production-grade architecture.

## 🚀 Features

### **Multi-Modal Input Processing**
- **Screenshot Analysis**: Advanced OCR with Gemini LLM for code extraction and problem understanding
- **Audio Transcription**: Real-time speech-to-text with intelligent context preservation
- **Text Input**: Direct problem statement processing with instant categorization
- **Mixed Input Support**: Seamless combination of multiple input types for comprehensive analysis

### **Intelligent Categorization & Response Generation**
- **Algorithm Problems**: Optimal solutions with complexity analysis and edge case handling
- **Technical Concepts**: Deep explanations with practical examples and best practices
- **Debugging & Optimization**: Systematic problem-solving with performance improvements
- **General Questions**: Context-aware responses for non-technical interview scenarios

### **Production-Grade Architecture**
- **Unified Processing Pipeline**: Consistent, reliable processing across all input types
- **Advanced Error Handling**: Robust fallback mechanisms and user-friendly error recovery
- **Performance Optimization**: Intelligent caching, image compression, and request queuing
- **Real-time Feedback**: Live progress indicators and streaming response display

### **Developer Experience**
- **Hot Reload**: Instant development feedback with Vite integration
- **TypeScript**: Full type safety and modern development practices
- **Comprehensive Testing**: Unit tests, integration tests, and E2E testing
- **Professional Documentation**: Detailed architecture and API documentation

## 🏗️ Architecture

### **Core Components**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ProcessingHelper │    │   LLMHelper     │    │   ScreenshotHelper│
│                 │    │                 │    │                 │
│ • Input Queue   │    │ • Gemini API    │    │ • Image Capture │
│ • Multi-Modal   │    │ • Classification │    │ • Optimization  │
│ • Error Handling│    │ • Response Gen. │    │ • Storage Mgmt. │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   AppState      │
                    │                 │
                    │ • State Mgmt.   │
                    │ • Event System  │
                    │ • UI Coordination│
                    └─────────────────┘
```

### **Processing Flow**

1. **Input Capture**: Screenshots, audio, or text input
2. **Content Extraction**: OCR, transcription, or direct text processing
3. **Intelligent Classification**: AI-powered categorization into problem types
4. **Structured Response**: Category-specific, production-quality solutions
5. **Real-time Display**: Streaming response with progress indicators

## 🛠️ Setup

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Gemini API key from Google AI Studio

### **Installation**

1. **Clone the repository**
   ```sh
git clone <repository-url>
   cd ai-meetings-assistant
   ```

2. **Install dependencies**
   ```sh
npm install
   ```

3. **Compile Electron TypeScript code**
   ```sh
   npx tsc -p electron/tsconfig.json
   ```

4. **Configure Gemini API Key**
   - On first launch, the app will prompt you to enter your Gemini API key in the settings
   - You can also set or update the key anytime from the app's Settings page

5. **Start the development server**
   ```sh
npm run app:dev
   ```
   - This will start both the Vite development server and the Electron app in development mode

6. **Build for production**
   ```sh
npm run build
   npm run app:build
```

## 📖 Usage

### **Basic Workflow**

1. **Capture Input**: Use the screenshot tool, audio recording, or text input
2. **Process**: The AI automatically categorizes and generates structured responses
3. **Review**: Get comprehensive solutions with complexity analysis and test cases
4. **Iterate**: Use additional screenshots for debugging and optimization

### **Keyboard Shortcuts**

- **Cmd/Ctrl + S**: Take screenshot
- **Cmd/Ctrl + R**: Reset queues and clear state
- **Cmd/Ctrl + Arrow Keys**: Move window position
- **Cmd/Ctrl + Shift + P**: Performance monitor (if enabled)

### **Input Types**

#### **Screenshot Input**
- Captures code problems, diagrams, or technical content
- Advanced OCR with context preservation
- Automatic problem categorization and solution generation

#### **Audio Input**
- Real-time speech-to-text transcription
- Context-aware processing for technical questions
- Seamless integration with other input types

#### **Text Input**
- Direct problem statement entry
- Instant categorization and response generation
- Highest reliability and fastest processing

## 🔧 Configuration

### **Model Selection**
- **Gemini 2.0 Flash**: Fast, balanced performance (default)
- **Gemini 2.0 Pro**: Higher quality, potentially slower
- **Gemini 2.5 Flash**: Latest model, faster processing
- **Gemini 2.5 Pro**: Latest model, highest quality

### **Performance Settings**
- **Cache Management**: LRU cache with configurable TTL
- **Image Optimization**: Automatic compression and resizing
- **Request Queuing**: Priority-based processing with rate limiting

## 🐛 Known Issues & Limitations

### **Current Limitations**
- **Single User**: Designed for individual use, not multi-user environments
- **Local Storage**: All data stored locally, no cloud persistence
- **API Dependencies**: Requires active internet connection for LLM processing
- **Memory Usage**: May use significant memory during large file processing

### **Performance Considerations**
- **Image Size**: Large screenshots may take longer to process
- **Network Latency**: API response times depend on internet connection
- **Concurrent Processing**: Limited to 3 simultaneous requests for API stability

### **Platform Support**
- **Primary**: macOS (fully tested and optimized)
- **Secondary**: Windows and Linux (basic support)
- **Mobile**: Not supported (desktop application)

## 🧪 Testing

### **Run Tests**
```sh
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

### **Test Coverage**
- **Unit Tests**: Core functionality and utility functions
- **Integration Tests**: API interactions and data flow
- **E2E Tests**: Complete user workflows and scenarios

## 📚 Documentation

### **Technical Documentation**
- [Architecture Guide](docs/ARCHITECTURE.md): Detailed system design and components
- [Performance Optimization](docs/PERFORMANCE_OPTIMIZATION.md): Optimization strategies and metrics
- [Technical Limitations](docs/TECHNICAL_LIMITATIONS_SOLUTIONS.md): Known issues and solutions
- [Future Development](docs/FUTURE_PLAN.md): Roadmap and planned improvements

### **Development Guides**
- [API Reference](docs/API_REFERENCE.md): Complete API documentation
- [Contributing Guidelines](CONTRIBUTING.md): Development setup and contribution process
- [Testing Strategy](docs/TESTING.md): Testing approach and best practices

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Development setup
- Code style and standards
- Testing requirements
- Pull request process

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI**: Gemini LLM API for intelligent processing
- **Electron**: Cross-platform desktop application framework
- **Vite**: Modern build tool for fast development
- **React**: UI framework for responsive interface
- **TypeScript**: Type-safe development experience

## 📞 Support

For support, questions, or feature requests:

1. **Issues**: Create an issue in the GitHub repository
2. **Documentation**: Check the comprehensive documentation

---
