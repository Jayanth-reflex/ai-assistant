# AI Meeting Assistant

[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue.svg)](https://www.typescriptlang.org/) [![Electron](https://img.shields.io/badge/Electron-25.x-blue.svg)](https://www.electronjs.org/) [![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg)](https://nodejs.org/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **A world-class, ultra-low-latency, multimodal AI interview assistant.**
> - Built for speed, reliability, and production-grade engineering.
> - Designed for technical interviews, code review, and real-time meeting intelligence.

---

## 📑 Table of Contents
- [Why This Project?](#why-this-project)
- [Key Features](#key-features)
- [Installation, Setup, and Usage](#-installation-setup-and-usage-guide)
- [Latency Optimization & Engineering](#latency-optimization--engineering)
- [Contributing](#contributing)
- [License](#license)

---

## Why This Project?

- **FAANG-level engineering:** Robust, modular, and scalable codebase.
- **Ultra-low latency:** Every pipeline stage is optimized for speed, with a clear roadmap for continuous improvement.
- **Multimodal:** Handles screenshots, audio, and text for technical interviews and meetings.
- **Traceable engineering:** All optimizations and architectural decisions are documented and tracked.

---

## Key Features

- 🖼️ **Screenshot-to-LLM:** Instantly extract and solve coding problems from screenshots.
- 🎤 **Real-time Audio Transcription:** Stream audio, get incremental ASR and LLM feedback.
- 💬 **Text Chat:** Fast, streaming LLM responses for technical Q&A.
- ⚡ **Streaming & In-Memory Processing:** Designed to minimize disk I/O and maximize responsiveness.
- 🛠️ **Production-Ready Electron + React + TypeScript Stack**
- 📊 **Latency Instrumentation:** Built-in profiling, logging, and a living optimization roadmap.

---

## 🚀 Installation, Setup, and Usage Guide

### 1. Prerequisites (Quick Install)

#### All-in-One Install Commands
- **Ubuntu/Debian:**
  ```bash
  sudo apt update && sudo apt install -y nodejs npm git python3 python3-pip
  ```
- **macOS (with Homebrew):**
  ```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  brew install node git python
  ```
- **Windows (with Chocolatey):**
  ```bash
  choco install -y nodejs git python
  ```

#### Manual Single-Command Installs (No Homebrew/Chocolatey)
- **Ubuntu/Debian:**
  - Node.js & npm: `sudo apt update && sudo apt install -y nodejs npm`
  - Git: `sudo apt install -y git`
  - Python 3: `sudo apt install -y python3 python3-pip`
- **macOS:** Download and install from [Node.js](https://nodejs.org/en/download/), [Git](https://git-scm.com/download/mac), [Python 3](https://www.python.org/downloads/macos/)
- **Windows:** Download and install from [Node.js](https://nodejs.org/en/download/), [Git](https://git-scm.com/download/win), [Python 3](https://www.python.org/downloads/windows/)

---

### 2. Clone the Repository
```bash
git clone <your-repo-url>
cd ai-meetings-assistant-UAT
```

### 3. Install Dependencies
```bash
npm install
cd renderer && npm install && cd ..
```

### 4. Build the Project
```bash
npx tsc -p electron/tsconfig.json
```

### 5. Development Mode
```bash
npm run app:dev
```
- Electron + Vite dev server (hot reload)
- Frontend: [http://localhost:5180](http://localhost:5180)

### 6. Production Build & Run
```bash
npm run build
npm run app
```

### 7. Configuration & API Keys
- Set your Gemini API key and other secrets in the app's Settings UI or in `electron/config.json` (created after first run).
- For ASR (Whisper, Deepgram, etc.), ensure Python/API dependencies are installed and configured.

### 8. Testing, Linting, Formatting
```bash
npm test         # Run all tests
npm run lint     # Lint code
npm run format   # Format code
```

### 9. Troubleshooting
- Re-run `npm install` in both root and `renderer/` if you see missing dependencies.
- Ensure Node/npm are up to date for Electron issues.
- Check Python installation for ASR issues.

---

## 🚦 Latency Optimization & Engineering

This project is engineered for **ultra-low latency**. Every stage of the pipeline is profiled, measured, and continuously improved. The codebase and documentation reflect a commitment to:
- In-memory and streaming-first data handling
- Async, event-driven, and non-blocking design
- GPU-accelerated and warm model hosting
- Real-time feedback and progressive UI updates
- Continuous profiling, monitoring, and performance logging

For advanced and future optimization ideas, see [`docs/FUTURE_PLAN.md`](./FUTURE_PLAN.md).

---

## 🤝 Contributing
- Please read the [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
- All optimizations and features should be clearly documented and referenced in PRs.

---

## 📄 License

This project is licensed under the [MIT License](../LICENSE). 