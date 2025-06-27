// FollowUpGenerator.ts
// Generates follow-up summary/email using Gemini
import { ipcMain } from 'electron';

/**
 * FollowUpGenerator provides static methods to generate follow-up summaries or emails using Gemini.
 */
export class FollowUpGenerator {
  /**
   * Generates a follow-up summary or email using session data and Gemini.
   * @param sessionPath - The path to the session folder containing relevant data.
   * @returns The generated follow-up summary or email as a string.
   */
  static async generate(sessionPath: string): Promise<string> {
    // TODO: Compose prompt from session data, call Gemini
    return '';
  }
}

// Register IPC handler for follow-up generation requests from renderer process.
ipcMain.handle('generate-followup', async (event, sessionPath) => {
  return await FollowUpGenerator.generate(sessionPath);
}); 