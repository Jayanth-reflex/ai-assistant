# 🏗️ Project Structure Documentation

> **Complete Architecture Overview - AI Meetings Assistant**

This document provides a comprehensive overview of the project structure, explaining the purpose and functionality of each file and folder in the AI Meetings Assistant application.

## 📁 **Root Directory Structure**

### **Core Configuration Files**
| File | Purpose | Description |
|------|---------|-------------|
| **`package.json`** | Main project configuration | Dependencies, scripts, and project metadata |
| **`package-lock.json`** | Dependency lock file | Ensures consistent builds across environments |
| **`pnpm-lock.yaml`** | Alternative package manager | PNPM lock file for dependency management |
| **`tsconfig.json`** | TypeScript configuration | Main TypeScript compiler settings |
| **`tsconfig.node.json`** | Node.js TypeScript config | TypeScript settings for Node.js environment |
| **`tailwind.config.js`** | Tailwind CSS configuration | CSS framework configuration and customization |
| **`postcss.config.js`** | PostCSS configuration | CSS processing pipeline configuration |
| **`playwright.config.ts`** | E2E testing configuration | End-to-end testing setup with Playwright |
| **`typedoc.json`** | API documentation config | TypeDoc settings for generating API docs |
| **`index.html`** | Main HTML entry point | Primary HTML file for the application |

### **Documentation Files**
| File | Purpose | Description |
|------|---------|-------------|
| **`README.md`** | Main project documentation | Setup instructions, features, and usage guide |
| **`LICENSE`** | Project license | Apache 2.0 license terms |
| **`doc.md`** | Additional documentation | Supplementary project information |
| **`.gitignore`** | Git ignore patterns | Files and folders excluded from version control |

### **Development Tools**
| Directory/File | Purpose | Description |
|----------------|---------|-------------|
| **`.husky/`** | Git hooks | Pre-commit validation and automation |
| **`node_modules/`** | Dependencies | Installed npm packages |
| **`.DS_Store`** | macOS system file | System-generated file (ignored) |

---

## 🖥️ **Electron Backend (`electron/`)**

The Electron backend handles the main application logic, AI processing, and system integration.

### **Core Application Files**
| File | Purpose | Description |
|------|---------|-------------|
| **`main.ts`** | Main Electron process | Application entry point, window management, app lifecycle |
| **`preload.ts`** | Preload script | Secure IPC communication between main and renderer processes |
| **`ipcHandlers.ts`** | IPC handlers | Inter-Process Communication handlers for main-renderer communication |
| **`shortcuts.ts`** | Global shortcuts | Keyboard shortcuts and hotkey management |

### **Core Processing Engine**
| File | Purpose | Description |
|------|---------|-------------|
| **`ProcessingHelper.ts`** | **Main processing orchestrator** | Handles all input types (screenshots, audio, text) with unified prompt engineering |
| **`LLMHelper.ts`** | **AI/LLM integration** | Manages Gemini API calls, model selection, and response generation |
| **`ScreenshotHelper.ts`** | Screenshot management | Screenshot capture, processing, and queue management |
| **`WindowHelper.ts`** | Window management | Window positioning, sizing, and UI management |

### **Services (`electron/services/`)**
| File | Purpose | Description |
|------|---------|-------------|
| **`index.ts`** | Service exports | Service initialization and exports |
| **`GeminiClient.ts`** | Gemini API client | Google Gemini API configuration and management |
| **`STTService.ts`** | Speech-to-Text service | Audio transcription service |
| **`whisper_transcribe.py`** | Whisper integration | Python script for Whisper-based audio transcription |
| **`AudioCapture.ts`** | Audio recording | Audio recording and capture functionality |
| **`ScreenCapture.ts`** | Screen capture | Screen capture and image processing |
| **`ResumeParser.ts`** | Resume parsing | Resume/CV parsing and analysis |
| **`SessionManager.ts`** | Session management | Interview session management and state persistence |
| **`ContextManager.ts`** | Context management | Context management for multi-turn conversations |
| **`FollowUpGenerator.ts`** | Follow-up generation | AI-powered follow-up question generation |
| **`HotkeyListener.ts`** | Hotkey detection | Global hotkey detection and handling |

### **Configuration**
| File | Purpose | Description |
|------|---------|-------------|
| **`tsconfig.json`** | TypeScript config | TypeScript configuration for Electron backend |

---

## 🎨 **Frontend (`src/`)**

The React frontend provides the user interface and interaction layer.

### **Main Application Files**
| File | Purpose | Description |
|------|---------|-------------|
| **`main.tsx`** | React entry point | React application initialization |
| **`App.tsx`** | Main app component | Main application component with routing and state management |
| **`index.css`** | Global styles | Global CSS styles and Tailwind imports |
| **`vite-env.d.ts`** | Vite types | Vite environment type definitions |

### **Pages (`src/_pages/`)**
| File | Purpose | Description |
|------|---------|-------------|
| **`Queue.tsx`** | Queue management | Input queue management and processing interface |
| **`Solutions.tsx`** | Solutions display | AI-generated solutions display and interaction |
| **`Settings.tsx`** | Settings interface | Application settings and configuration management |
| **`Debug.tsx`** | Debug interface | Debug interface for development and troubleshooting |

### **Components (`src/components/`)**

#### **Queue Management (`Queue/`)**
| File | Purpose | Description |
|------|---------|-------------|
| **`ScreenshotQueue.tsx`** | Queue display | Screenshot queue display and management |
| **`ScreenshotItem.tsx`** | Item component | Individual screenshot item component |
| **`QueueCommands.tsx`** | Queue controls | Queue control commands and actions |

#### **Solutions Display (`Solutions/`)**
| File | Purpose | Description |
|------|---------|-------------|
| **`SolutionCommands.tsx`** | Solution controls | Solution interaction commands and actions |

#### **Content Display (`ScrollableContent/`)**
| File | Purpose | Description |
|------|---------|-------------|
| **`ScrollableContent.tsx`** | Content container | Scrollable content container component |

#### **UI Components (`ui/`)**
| File | Purpose | Description |
|------|---------|-------------|
| **`card.tsx`** | Card component | Reusable card component for content display |
| **`dialog.tsx`** | Dialog component | Dialog/modal component for overlays |
| **`toast.tsx`** | Toast component | Toast notification component |

### **Types (`src/types/`)**
| File | Purpose | Description |
|------|---------|-------------|
| **`index.tsx`** | Main types | Primary type definitions and exports |
| **`audio.ts`** | Audio types | Audio-related type definitions |
| **`electron.d.ts`** | Electron types | Electron-specific type definitions |
| **`global.d.ts`** | Global types | Global type definitions and declarations |
| **`session.ts`** | Session types | Session management type definitions |
| **`solutions.ts`** | Solution types | Solution-related type definitions |

### **Utilities (`src/lib/`)**
| File | Purpose | Description |
|------|---------|-------------|
| **`preferences.ts`** | Preferences management | User preferences and settings management |
| **`utils.ts`** | Utility functions | General utility functions and helpers |

---

## 📚 **Documentation (`docs/`)**

Comprehensive documentation for development, deployment, and maintenance.

### **Technical Documentation**
| File | Purpose | Description |
|------|---------|-------------|
| **`ARCHITECTURE.md`** | System architecture | System architecture and design patterns |
| **`PROMPTS.md`** | AI prompt engineering | AI prompt engineering and response formats |
| **`PERFORMANCE_OPTIMIZATION.md`** | Performance guide | Performance tuning and optimization strategies |
| **`TECHNICAL_LIMITATIONS_SOLUTIONS.md`** | Limitations guide | Known limitations and their solutions |
| **`FUTURE_PLAN.md`** | Development roadmap | Roadmap and future development plans |
| **`TESTING.md`** | Testing guide | Testing strategies and implementation |
| **`COMMENTING_PROGRESS.md`** | Code documentation | Code commenting and documentation progress |
| **`REDUNDANCY_AND_SECURITY_ANALYSIS.md`** | Security analysis | Security analysis and redundancy assessment |
| **`PACKAGE_JSON.md`** | Package analysis | Package.json analysis and dependency management |

---

## 🧪 **Testing (`tests/`)**

Comprehensive testing suite for quality assurance.

### **Unit Tests**
| File | Purpose | Description |
|------|---------|-------------|
| **`ResumeParser.test.ts`** | Resume parser tests | Resume parser functionality unit tests |
| **`SessionManager.test.ts`** | Session manager tests | Session management unit tests |
| **`History.test.tsx`** | History component tests | History component React tests |
| **`OCRService.test.ts`** | OCR service tests | OCR service tests (legacy) |

### **End-to-End Tests**
| File | Purpose | Description |
|------|---------|-------------|
| **`e2e.spec.ts`** | Main E2E tests | Primary end-to-end test suite |
| **`e2e-followup.spec.ts`** | Follow-up E2E tests | Follow-up functionality E2E tests |
| **`e2e-resume-upload.spec.ts`** | Resume upload E2E tests | Resume upload functionality E2E tests |
| **`electron.e2e.ts`** | Electron E2E tests | Electron-specific end-to-end tests |

---

## 🔧 **Build and Distribution**

### **Build Outputs**
| Directory/File | Purpose | Description |
|----------------|---------|-------------|
| **`dist-electron/`** | Compiled Electron app | Compiled Electron application files |
| **`worker-script/`** | Background workers | Worker script for background processing |
| **`worker-script/node/index.js`** | Node.js worker | Node.js worker implementation |

### **Legacy Renderer (`renderer/`)**
| File | Purpose | Description |
|------|---------|-------------|
| **`src/`** | Legacy React components | Legacy React components (partially migrated) |
| **`public/`** | Static assets | Static assets and resources |
| **`package.json`** | Legacy dependencies | Legacy renderer dependencies |
| **`tsconfig.json`** | Legacy TypeScript config | Legacy TypeScript configuration |

---

## 🔄 **Data Flow Architecture**

### **Input Processing Pipeline**
```
1. Input Capture → ScreenshotHelper.ts / AudioCapture.ts / Text input
2. Queue Management → Queue.tsx components
3. Processing Orchestration → ProcessingHelper.ts
4. AI Processing → LLMHelper.ts → GeminiClient.ts
5. Response Generation → Category-specific prompts and formatting
6. Display → Solutions.tsx components
```

### **State Management**
- **Session State** → `SessionManager.ts`
- **Context Management** → `ContextManager.ts`
- **User Preferences** → `preferences.ts`
- **UI State** → React components with local state

### **Communication Flow**
- **Main ↔ Renderer** → `ipcHandlers.ts` + `preload.ts`
- **Global Hotkeys** → `HotkeyListener.ts` → `shortcuts.ts`
- **File Operations** → `WindowHelper.ts` + IPC handlers

---

## 🎯 **Key Features by Component**

### **AI Processing Engine**
| Component | Role | Key Features |
|-----------|------|--------------|
| **`ProcessingHelper.ts`** | Main orchestrator | Unified processing for all input types |
| **`LLMHelper.ts`** | AI integration | Advanced prompt engineering and AI integration |
| **`GeminiClient.ts`** | API client | Google Gemini API integration |

### **Input Management**
| Component | Role | Key Features |
|-----------|------|--------------|
| **`ScreenshotHelper.ts`** | Screenshot processing | Screenshot capture and processing |
| **`AudioCapture.ts`** | Audio processing | Audio recording and transcription |
| **`Queue.tsx`** | Queue interface | Input queue management interface |

### **User Interface**
| Component | Role | Key Features |
|-----------|------|--------------|
| **`App.tsx`** | Main application | Main application with routing |
| **`Solutions.tsx`** | Response display | AI response display and interaction |
| **`Settings.tsx`** | Configuration | Configuration management |
| **`Debug.tsx`** | Development tools | Development and troubleshooting tools |

### **System Integration**
| Component | Role | Key Features |
|-----------|------|--------------|
| **`main.ts`** | App lifecycle | Electron application lifecycle |
| **`WindowHelper.ts`** | Window management | Window management and positioning |
| **`SessionManager.ts`** | Session persistence | Interview session persistence |

---

## 🚀 **Development Workflow**

### **File Organization Principles**
1. **Separation of Concerns**: Clear separation between frontend, backend, and services
2. **Modular Architecture**: Each component has a single responsibility
3. **Type Safety**: Comprehensive TypeScript usage throughout
4. **Documentation**: Extensive documentation for all major components
5. **Testing**: Unit and E2E tests for critical functionality

### **Code Organization**
- **Electron Backend**: Main process, services, and system integration
- **React Frontend**: User interface and interaction layer
- **Shared Types**: Common type definitions across frontend and backend
- **Documentation**: Comprehensive guides and technical documentation
- **Testing**: Quality assurance and validation

### **Build Process**
1. **TypeScript Compilation**: `npx tsc -p electron/tsconfig.json`
2. **Frontend Build**: Vite-based React build process
3. **Electron Packaging**: Electron builder for distribution
4. **Testing**: Automated testing before deployment

---

## 📊 **Technology Stack**

### **Backend Technologies**
- **Electron**: Cross-platform desktop application framework
- **TypeScript**: Type-safe JavaScript development
- **Google Gemini API**: Advanced AI/LLM integration
- **Node.js**: Server-side JavaScript runtime

### **Frontend Technologies**
- **React**: User interface library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server

### **Development Tools**
- **Playwright**: End-to-end testing
- **TypeDoc**: API documentation generation
- **Husky**: Git hooks for code quality
- **ESLint/Prettier**: Code formatting and linting

---

## 🔍 **File Naming Conventions**

### **TypeScript Files**
- **`.ts`**: Pure TypeScript files (backend)
- **`.tsx`**: TypeScript files with JSX (React components)
- **`.d.ts`**: TypeScript declaration files

### **Configuration Files**
- **`.json`**: JSON configuration files
- **`.js`**: JavaScript configuration files
- **`.ts`**: TypeScript configuration files

### **Documentation Files**
- **`.md`**: Markdown documentation files
- **`README.md`**: Main documentation for each directory
- **`*.md`**: Specific documentation files

---

## 🎯 **Architecture Benefits**

### **Scalability**
- **Modular Design**: Easy to add new features and components
- **Service Architecture**: Independent services for different functionalities
- **Type Safety**: Comprehensive TypeScript usage prevents runtime errors

### **Maintainability**
- **Clear Structure**: Well-organized file and folder structure
- **Comprehensive Documentation**: Extensive documentation for all components
- **Testing Coverage**: Unit and E2E tests for critical functionality

### **Performance**
- **Optimized Build Process**: Efficient compilation and bundling
- **Lazy Loading**: Components loaded on demand
- **Caching Strategy**: Intelligent caching for repeated operations

### **Developer Experience**
- **Hot Reload**: Fast development with hot reloading
- **Type Safety**: IntelliSense and error detection
- **Debugging Tools**: Comprehensive debugging and development tools

---

**This architecture provides a production-ready, scalable AI interview assistant with comprehensive input processing, advanced AI integration, and a modern user interface designed for technical interview coaching.** 