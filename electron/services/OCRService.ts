// OCRService.ts
// Service to run OCR on images using Tesseract.js
import { ipcMain } from 'electron';
import Tesseract from 'tesseract.js';

/**
 * OCRService provides static methods to extract text from images using Tesseract.js.
 */
export class OCRService {
  /**
   * Extracts text from the given image file using Tesseract.js.
   * @param imagePath - The path to the image file to be processed.
   * @returns The extracted text as a string.
   */
  static async extractText(imagePath: string): Promise<string> {
    const result = await Tesseract.recognize(imagePath, 'eng');
    return result.data.text;
  }
}

// Register IPC handler for OCR requests from renderer process.
ipcMain.handle('run-ocr', async (event, imagePath) => {
  return await OCRService.extractText(imagePath);
}); 