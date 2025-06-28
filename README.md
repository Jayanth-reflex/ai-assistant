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
- **Transparency**: Use the tool responsibly and inform others when AI is being used
- **Compliance**: Follow all applicable laws, regulations, and company policies

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

## 🚀 Setup & Usage

### 1. **Install Dependencies**
```sh
npm install
```

### 2. **Start the App in Development Mode**
```sh
npm run app:dev
```

### 3. **Set Your Gemini API Key (In-App Settings)**
- Launch the app.
- Click the **Settings** (gear icon) button in the main interface (beside the Record Voice button).
- Paste your [Google Gemini API key](https://aistudio.google.com/app/apikey) into the input field and click **Save**.
- Your API key is securely stored in your local app data and will persist across sessions.

> **Note:** You no longer need to edit a `.env` file. All API key management is handled securely in-app.

### 4. **Using the App**
- **Take a Screenshot**: Use the shortcut (Cmd+H) to capture a problem statement or code.
- **Record Voice**: Click the microphone button to record a spoken question or answer.
- **Process (Cmd+Enter)**: Processes the current input (screenshot or voice) and generates an AI-powered response.
- **Reset (Cmd+R)**: Clears the current session and returns to the home view.

## 🧑‍💻 Contributing
- Fork the repo and create a feature branch
- Submit a pull request with a clear description

## 📄 License
MIT License

## 🌐 Links
- [Google Gemini API Key Signup](https://aistudio.google.com/app/apikey)
- [Project Issues](https://github.com/your-repo/issues)

## 📁 Project Structure

```
.
├── electron/         # Electron main process & backend services
├── src/              # React frontend (pages, components, types)
├── renderer/         # Renderer process (React app entry, assets)
├── tests/            # Automated and unit tests
├── worker-script/    # Node worker scripts
├── package.json      # Project metadata & scripts
├── README.md         # Project documentation
├── LICENSE           # License file
└── ... (other config and meta files)
```

## 🆘 Support

For support and questions:
- Check the troubleshooting section above
- Review the code documentation
- Open an issue for bugs or feature requests

---
