# Package.json Configuration Documentation

> Comprehensive explanation of the AI Interview Assistant's package.json configuration, dependencies, and build setup.

## Overview

This document provides detailed explanations for every section of the `package.json` file, including the purpose of each dependency, script, and configuration option.

## Application Metadata

```json
{
  "name": "interview-coder",           // Project name for npm registry
  "version": "1.0.0",                 // Semantic versioning - major.minor.patch
  "main": "./dist-electron/main.js",  // Entry point for Electron main process
}
```

## NPM Scripts

### Development Scripts
- **`clean`**: Removes build artifacts and temporary files using rimraf
- **`dev`**: Starts Vite development server for frontend development
- **`build`**: Cleans, compiles TypeScript, and builds the entire application
- **`preview`**: Serves the built frontend application for preview

### Electron Scripts
- **`electron:dev`**: Compiles Electron backend TypeScript and starts Electron in development mode
- **`app:dev`**: Runs both frontend dev server and Electron app concurrently
- **`app:build`**: Builds and packages the application for distribution
- **`watch`**: Watches Electron backend TypeScript files for changes
- **`build:electron`**: Builds Electron application for distribution

### Utility Scripts
- **`prepare`**: Installs Git hooks for pre-commit linting and formatting
- **`dist`**: Creates distribution packages without installing
- **`pack`**: Creates application packages

## Electron Builder Configuration

### Application Identity
```json
{
  "appId": "com.ai.interview.assistant",     // Unique identifier for the application
  "productName": "AI Interview Assistant"    // Display name for the application
}
```

### Files to Include
- `dist/**`: Built frontend files
- `dist-electron/**`: Built Electron backend files
- `electron/**`: Source Electron files
- `src/**`: Source frontend files
- `package.json`: Package configuration

### Platform-Specific Builds

#### macOS
- **Category**: `public.app-category.utilities` (App Store category)
- **Targets**: 
  - `dmg`: Disk image for easy installation
  - `zip`: Compressed archive
- **Icon**: `assets/icons/mac/icon.icns`

#### Windows
- **Targets**:
  - `nsis`: Windows installer
  - `zip`: Compressed archive
- **Icon**: `assets/icons/win/icon.ico`

#### Linux
- **Targets**:
  - `AppImage`: Portable Linux application
  - `deb`: Debian package
  - `rpm`: Red Hat package
- **Icon**: `assets/icons/png/icon-256x256.png`

### Auto-Updater Configuration
- **Provider**: GitHub
- **Owner**: ibttf
- **Repository**: interview-coder-frontend

## Development Dependencies

### Testing Frameworks
- **`@playwright/test`**: End-to-end testing framework
- **`@testing-library/jest-dom`**: Custom Jest matchers for DOM testing
- **`@testing-library/react`**: Testing utilities for React components

### TypeScript Type Definitions
- **`@types/color`**: Types for color manipulation library
- **`@types/diff`**: Types for diff library
- **`@types/electron`**: Types for Electron
- **`@types/jest`**: Types for Jest testing framework
- **`@types/node`**: Types for Node.js
- **`@types/react`**: Types for React
- **`@types/react-dom`**: Types for React DOM
- **`@types/react-syntax-highlighter`**: Types for syntax highlighting
- **`@types/screenshot-desktop`**: Types for screenshot library
- **`@types/uuid`**: Types for UUID generation

### Code Quality Tools
- **`@typescript-eslint/eslint-plugin`**: TypeScript ESLint plugin
- **`@typescript-eslint/parser`**: TypeScript ESLint parser
- **`eslint`**: JavaScript/TypeScript linter
- **`eslint-config-prettier`**: ESLint configuration for Prettier
- **`eslint-plugin-prettier`**: Prettier ESLint plugin
- **`eslint-plugin-react`**: React ESLint plugin
- **`prettier`**: Code formatter

### Build Tools
- **`@vitejs/plugin-react`**: Vite plugin for React
- **`vite`**: Fast build tool and dev server
- **`vite-plugin-electron`**: Vite plugin for Electron
- **`vite-plugin-electron-renderer`**: Vite plugin for Electron renderer

### CSS and Styling
- **`autoprefixer`**: CSS vendor prefixing
- **`postcss`**: CSS transformation tool
- **`tailwindcss`**: Utility-first CSS framework

### Development Workflow
- **`concurrently`**: Run multiple commands concurrently
- **`cross-env`**: Set environment variables cross-platform
- **`wait-on`**: Wait for resources to become available

### Electron Development
- **`electron`**: Desktop application framework
- **`electron-builder`**: Electron application packaging
- **`electron-is-dev`**: Detect if running in development

### Git Hooks and Code Quality
- **`husky`**: Git hooks manager
- **`lint-staged`**: Run linters on staged files

### Documentation
- **`typedoc`**: TypeScript documentation generator

### TypeScript
- **`typescript`**: TypeScript compiler

### Utilities
- **`rimraf`**: Cross-platform rm -rf utility

## Production Dependencies

### AI and Machine Learning
- **`@google/genai`**: Google Generative AI SDK
- **`@google/generative-ai`**: Google Generative AI (alternative)

### UI Component Libraries
- **`@radix-ui/react-dialog`**: Accessible dialog component
- **`@radix-ui/react-toast`**: Accessible toast notification component
- **`lucide-react`**: Icon library
- **`react-icons`**: Icon library for React

### React Ecosystem
- **`react`**: React library
- **`react-dom`**: React DOM rendering
- **`react-query`**: Data fetching and caching
- **`react-syntax-highlighter`**: Syntax highlighting for code
- **`react-code-blocks`**: Code block components

### Utility Libraries
- **`axios`**: HTTP client
- **`class-variance-authority`**: Component variant management
- **`clsx`**: Conditional className utility
- **`diff`**: Text diffing library
- **`form-data`**: Form data handling
- **`uuid`**: UUID generation

### Document Processing
- **`mammoth`**: Word document (.docx) processing
- **`pdf-parse`**: PDF text extraction

### Audio Processing
- **`node-record-lpcm16`**: Audio recording library

### Image and Screenshot Processing
- **`screenshot-desktop`**: Desktop screenshot capture
- **`sharp`**: Image processing library
- **`tesseract.js`**: OCR (Optical Character Recognition)

### Type Definitions
- **`@types/tesseract.js`**: Types for Tesseract.js

### CSS Utilities
- **`tailwind-merge`**: Tailwind CSS class merging utility

## Pre-commit Hooks Configuration

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix"  // Auto-fix linting issues
    ],
    "*.{js,jsx,ts,tsx,css,md,json}": [
      "prettier --write"  // Format code
    ]
  }
}
```

This configuration ensures that:
1. All staged JavaScript/TypeScript files are linted and auto-fixed
2. All supported file types are formatted with Prettier
3. Code quality is maintained before commits

## Build Process Flow

1. **Development**: `npm run app:dev`
   - Starts Vite dev server on port 5180
   - Waits for server to be ready
   - Starts Electron with development environment

2. **Building**: `npm run build`
   - Cleans previous build artifacts
   - Compiles TypeScript
   - Builds frontend with Vite

3. **Packaging**: `npm run app:build`
   - Builds the application
   - Packages with Electron Builder
   - Creates platform-specific installers

## Environment Variables

- **`NODE_ENV=development`**: Set during development to enable dev tools
- **Port 5180**: Used for Vite dev server to avoid conflicts

## Security Considerations

- All dependencies are regularly updated for security patches
- Development dependencies are separated from production dependencies
- Type definitions are included to prevent runtime errors
- Linting and formatting ensure code quality and consistency

---

*This documentation should be updated whenever dependencies or build configuration changes.* 