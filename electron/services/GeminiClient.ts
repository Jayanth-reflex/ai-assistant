// GeminiClient.ts
// Service to send prompt to Gemini API and return response
import { ipcMain } from 'electron';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not set in environment');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}

// Register IPC handler for Gemini prompt requests from renderer process.
ipcMain.handle('gemini-prompt', async (event, prompt) => {
  return await GeminiClient.sendPrompt(prompt);
}); 