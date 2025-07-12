export interface ElectronAPI {
  getGeminiModel: () => Promise<string>;
  setGeminiModel: (model: string) => Promise<void>;
  getGeminiApiKey: () => Promise<string>;
  setGeminiApiKey: (key: string) => Promise<void>;
  // Add other methods as needed from preload.ts
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
} 