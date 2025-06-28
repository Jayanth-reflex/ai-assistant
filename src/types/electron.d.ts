export interface ElectronAPI {
  version: () => string;
  ping: () => string;
  updateContentDimensions: (dimensions: {
    width: number
    height: number
  }) => Promise<void>
  getScreenshots: () => Promise<Array<{ path: string; preview: string; type?: 'image' | 'audio' | 'text' | 'unknown' }>>
  deleteScreenshot: (path: string) => Promise<{ success: boolean; error?: string }>
  onScreenshotTaken: (callback: (data: { path: string; preview: string; type?: 'image' | 'audio' | 'text' | 'unknown' }) => void) => () => void
  onSolutionsReady: (callback: (solutions: string) => void) => () => void
  onResetView: (callback: () => void) => () => void
  onSolutionStart: (callback: () => void) => () => void
  onDebugStart: (callback: () => void) => () => void
  onDebugSuccess: (callback: (data: any) => void) => () => void
  onSolutionError: (callback: (error: string) => void) => () => void
  onProcessingNoScreenshots: (callback: () => void) => () => void
  onProblemExtracted: (callback: (data: any) => void) => () => void
  onSolutionSuccess: (callback: (data: any) => void) => () => void
  onUnauthorized: (callback: () => void) => () => void
  onDebugError: (callback: (error: string) => void) => () => void
  takeScreenshot: () => Promise<void>
  moveWindowLeft: () => Promise<void>
  moveWindowRight: () => Promise<void>
  analyzeAudioFromBase64: (data: string, mimeType: string) => Promise<{ text: string; timestamp: number }>
  analyzeAudioFile: (path: string) => Promise<{ text: string; timestamp: number }>
  analyzeImageFile: (path: string) => Promise<void>
  quitApp: () => Promise<void>
  saveTempFile: (fileName: string, data: Uint8Array | ArrayBuffer) => Promise<string>
  getCurrentSessionPath: () => Promise<string>
  listSessions: () => Promise<string[]>
  getGeminiApiKey: () => Promise<string>
  setGeminiApiKey: (key: string) => Promise<void>
  addFileToQueue: (filePath: string) => Promise<{ success: boolean; error?: string }>
  processInputQueue: (inputQueue: Array<{ type: 'screenshot' | 'audio' | 'text', value: string }>) => Promise<{ success: boolean; error?: string }>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
} 