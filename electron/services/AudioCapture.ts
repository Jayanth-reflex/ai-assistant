// AudioCapture.ts
// Service to record system audio and save to session folder
import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import record from 'node-record-lpcm16';

/**
 * AudioCapture provides static methods to record system audio and save it to a session folder.
 */
export class AudioCapture {
  /**
   * Records system audio and saves it as a WAV file in the session folder.
   * @param sessionPath - The path to the session folder where the audio will be saved.
   * @returns The file path of the saved audio file.
   */
  static async recordAndSave(sessionPath: string): Promise<string> {
    const audioDir = path.join(sessionPath, 'audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    const fileName = `audio_${Date.now()}.wav`;
    const filePath = path.join(audioDir, fileName);
    // Record 5 seconds of audio for demo
    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(filePath, { encoding: 'binary' });
      const rec = record
        .record({ sampleRate: 16000, threshold: 0, verbose: false, recordProgram: 'sox' })
        .stream()
        .pipe(fileStream);
      setTimeout(() => {
        record.stop();
        fileStream.close();
        resolve(filePath);
      }, 5000); // 5 seconds
      rec.on('error', (err: any) => {
        reject(err);
      });
    });
  }
}

// Register IPC handler for audio capture requests from renderer process.
ipcMain.handle('capture-audio', async (event, sessionPath) => {
  return await AudioCapture.recordAndSave(sessionPath);
}); 