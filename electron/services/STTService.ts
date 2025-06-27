// STTService.ts
// Service to transcribe audio using Whisper (Python subprocess)
import { ipcMain } from 'electron';
import { spawn } from 'child_process';
import path from 'path';

/**
 * STTService provides static methods to transcribe audio files using OpenAI Whisper via a Python subprocess.
 */
export class STTService {
  /**
   * Transcribes the given audio file using Whisper (Python subprocess).
   * @param audioPath - The path to the audio file to be transcribed.
   * @returns The transcribed text as a string.
   */
  static async transcribe(audioPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Path to the Python script for Whisper transcription
      const scriptPath = path.join(__dirname, 'whisper_transcribe.py');
      // Spawn a Python process to run the Whisper script
      const python = spawn('python3', [scriptPath, audioPath]);
      let transcript = '';
      let error = '';
      // Collect stdout data (transcription result)
      python.stdout.on('data', (data) => {
        transcript += data.toString();
      });
      // Collect stderr data (errors)
      python.stderr.on('data', (data) => {
        error += data.toString();
      });
      // Handle process close event
      python.on('close', (code) => {
        if (code === 0) {
          resolve(transcript.trim());
        } else {
          reject(new Error(error || 'Whisper subprocess failed'));
        }
      });
    });
  }
}

// Register IPC handler for audio transcription requests from renderer process.
ipcMain.handle('transcribe-audio', async (event, audioPath) => {
  return await STTService.transcribe(audioPath);
}); 