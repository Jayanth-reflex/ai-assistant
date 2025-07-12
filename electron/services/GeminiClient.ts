// GeminiClient.ts
// Service to send prompt to Gemini API and return response
import { ipcMain } from 'electron';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

/**
 * GeminiClient provides static methods to send prompts to the Gemini API and receive responses.
 */
export class GeminiClient {
  /**
   * Sends a prompt to the Gemini API and returns the response.
   * @param prompt - The prompt string to send.
   * @returns The response from Gemini as a string.
   */
  static async sendPrompt(prompt: string): Promise<string> {
    const configPath = path.join(app.getPath('userData'), 'config.json');
    let apiKey = '';
    let model = 'gemini-2.0-flash';
    try {
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        apiKey = config.apiKey || '';
        model = config.model || 'gemini-2.0-flash';
      }
    } catch (e) {
      console.error('[GeminiClient] Error reading config:', e);
    }
    if (!apiKey) throw new Error('Gemini API key not set in config');
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('[GeminiClient] Using model:', model);
    const modelInstance = genAI.getGenerativeModel({ model });
    const result = await modelInstance.generateContent(prompt);
    return result.response.text();
  }
}

// Register IPC handler for Gemini prompt requests from renderer process.
ipcMain.handle('gemini-prompt', async (event, prompt) => {
  return await GeminiClient.sendPrompt(prompt);
}); 