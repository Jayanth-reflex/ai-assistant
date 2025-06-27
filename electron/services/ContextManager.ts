// ContextManager.ts
// Maintains rolling buffer of transcript and screen text, composes prompts
import { ipcMain } from 'electron';

/**
 * ContextManager maintains a rolling buffer of recent transcript and screen text,
 * and composes prompts for the Gemini API.
 */
export class ContextManager {
  /**
   * Buffer object holding arrays of transcript and screen text.
   */
  static buffer: { transcript: string[]; screenText: string[] } = { transcript: [], screenText: [] };

  /**
   * Adds a transcript string to the buffer. Trims buffer if needed.
   * @param text - The transcript text to add.
   */
  static addTranscript(text: string) {
    // TODO: Add to buffer, trim if needed
  }

  /**
   * Adds screen text to the buffer. Trims buffer if needed.
   * @param text - The screen text to add.
   */
  static addScreenText(text: string) {
    // TODO: Add to buffer, trim if needed
  }

  /**
   * Composes a prompt for Gemini using the buffer and provided skills.
   * @param skills - The user's key skills for context.
   * @returns The composed prompt string.
   */
  static composePrompt(skills: string): string {
    // TODO: Format prompt for Gemini
    return '';
  }
}

// Register IPC handler for prompt composition requests from renderer process.
ipcMain.handle('compose-prompt', async (event, skills) => {
  return ContextManager.composePrompt(skills);
}); 