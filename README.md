# AI Interview Assistant

> A professional desktop application for AI-powered interview coaching and real-time assistance during meetings and interviews.

## 📋 Legal & Ethical Considerations

### Privacy & Data Protection
- **Local Processing**: All audio and screen capture is processed locally on your device
- **No Cloud Storage**: No personal data is stored in the cloud or shared with third parties
- **API Usage**: Only text content (transcripts, OCR text) is sent to Google's Gemini API for analysis
- **Data Retention**: All session data is stored locally and can be deleted at any time

### Ethical Usage Guidelines
- **Consent**: Ensure all participants in meetings/interviews are aware of and consent to AI assistance
- **Transparency**: Disclose the use of AI tools when required by company policies or regulations
- **Professional Use**: Use responsibly and in accordance with your organization's guidelines
- **No Recording Without Permission**: Always obtain proper consent before recording or analyzing conversations

### Compliance
- **GDPR**: Compliant with data protection regulations through local-only processing
- **Corporate Policies**: Review and comply with your organization's AI usage policies
- **Industry Standards**: Follow ethical AI guidelines and best practices

## 🚀 Features

### Core Functionality
- **Real-time Screen Capture**: Automatic and manual screenshot capture with OCR
- **Audio Transcription**: Live speech-to-text conversion using Whisper
- **AI-Powered Coaching**: Contextual interview suggestions and feedback
- **Smart Context Analysis**: Combines screen content and audio for comprehensive insights
- **Session Management**: Local storage of all interactions and data
- **Hotkey Controls**: Global keyboard shortcuts for seamless operation

### Advanced Features
- **Document Analysis**: Resume and document parsing for interview preparation
- **Follow-up Generation**: Automated post-meeting summaries and action items
- **Multi-modal AI**: Combines text, audio, and visual context for better responses
- **Cross-platform Support**: Works on macOS and Windows
- **Always-on-top Interface**: Non-intrusive overlay for easy access

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework with TypeScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Electron** - Cross-platform desktop application framework

### Backend & AI
- **Node.js** - Server-side JavaScript runtime
- **Google Gemini API** - Advanced AI model for text analysis and generation
- **OpenAI Whisper** - Speech-to-text transcription
- **Tesseract.js** - OCR (Optical Character Recognition) for screen text extraction

### Development & Testing
- **TypeScript** - Type-safe JavaScript development
- **Playwright** - End-to-end testing framework
- **ESLint & Prettier** - Code quality and formatting
- **Husky** - Git hooks for code quality

### Build & Deployment
- **Electron Builder** - Application packaging and distribution
- **Cross-env** - Cross-platform environment variable management
- **Concurrently** - Parallel process management

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Python 3.8+** - Required for Whisper STT
- **Gemini API Key** - Free from Google AI Studio

### Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key (starts with `AIza...`)
5. Keep this key secure - you'll need it for setup

### Step 2: Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-meetings-assistant.git
cd ai-meetings-assistant

# Install Node.js dependencies
npm install

# Install Python dependencies for Whisper
pip3 install openai-whisper torch
```

### Step 3: Configure Environment

1. Create a `.env` file in the project root:
```bash
touch .env
```

2. Add your Gemini API key to the `.env` file:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

**⚠️ Security Note**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

### Step 4: Install Whisper (Speech-to-Text)

#### macOS
```bash
# Install Python if not already installed
brew install python

# Install Whisper and PyTorch
pip3 install openai-whisper torch

# Verify installation
python3 -c "import whisper; print('Whisper installed successfully')"
```

#### Windows
```bash
# Download Python from python.org and add to PATH
# Then install Whisper
pip install openai-whisper torch

# Verify installation
python -c "import whisper; print('Whisper installed successfully')"
```

## 🚀 Running the Application

### Development Mode (Recommended for first run)

```bash
# Start the development server and Electron app
npm run app:dev
```

This command will:
- Start the Vite development server on port 5180
- Launch the Electron application
- Enable hot reloading for development

### Production Build

```bash
# Build the application
npm run build

# The built app will be in the release/ folder
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + B` | Toggle window visibility |
| `Cmd/Ctrl + H` | Take screenshot and analyze |
| `Cmd/Ctrl + Enter` | Get AI solution/assistance |
| `Cmd/Ctrl + R` | Reset/clear current session |
| `Cmd/Ctrl + Arrow Keys` | Move window position |
| `Cmd/Ctrl + Q` | Quit application |

## 🔧 Troubleshooting

### Common Issues

**App won't start:**
```bash
# Kill existing processes on port 5180
lsof -i :5180
kill -9 [PID]

# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Whisper not working:**
```bash
# Reinstall Whisper
pip3 uninstall openai-whisper
pip3 install openai-whisper torch

# Test installation
python3 -c "import whisper; model = whisper.load_model('base'); print('OK')"
```

**API Key issues:**
- Verify your `.env` file exists and contains the correct API key
- Check that the API key starts with `AIza`
- Ensure you have sufficient Gemini API quota

### Performance Optimization

- **GPU Acceleration**: Install CUDA for faster Whisper processing (optional)
- **Memory Usage**: Close other applications if experiencing slowdowns
- **Storage**: Ensure adequate disk space for session data

## 📁 Project Structure

```
ai-meetings-assistant/
├── electron/           # Electron main process
│   ├── services/      # Backend services
│   └── main.ts        # Main process entry
├── src/               # React frontend
│   ├── components/    # UI components
│   ├── _pages/        # Page components
│   └── types/         # TypeScript definitions
├── tests/             # Test files
├── release/           # Built application
└── .env              # Environment variables (not in git)
```

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Disclaimer

This application is provided "as is" without warranties. Users are responsible for:
- Complying with local laws and regulations
- Obtaining proper consent for recording/analysis
- Following their organization's policies
- Using the application ethically and responsibly

## 🆘 Support

For support and questions:
- Check the troubleshooting section above
- Review the code documentation
- Open an issue for bugs or feature requests

---

**Built with ❤️ for professional interview assistance**
