// ScreenCapture.ts
// Service to capture desktop or window screenshots and save to session folder
import { desktopCapturer, ipcMain, nativeImage } from 'electron';
import fs from 'fs';
import path from 'path';

/**
 * ScreenCapture provides static methods to capture screenshots and save them to a session folder.
 */
export class ScreenCapture {
  /**
   * Captures a screenshot of the primary display and saves it as a PNG file in the session folder.
   * @param sessionPath - The path to the session folder where the screenshot will be saved.
   * @returns The file path of the saved screenshot.
   */
  static async captureAndSave(sessionPath: string): Promise<string> {
    // Ensure screenshots directory exists
    const screenshotsDir = path.join(sessionPath, 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    // Get all available sources (screens)
    const sources = await desktopCapturer.getSources({ types: ['screen'] });
    // Use the first screen (primary display)
    const screenSource = sources[0];
    if (!screenSource) throw new Error('No screen source found');
    // Get the image as a PNG buffer
    const image = nativeImage.createFromDataURL(screenSource.thumbnail.toDataURL());
    const buffer = image.toPNG();
    // Save to file
    const fileName = `screenshot_${Date.now()}.png`;
    const filePath = path.join(screenshotsDir, fileName);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }
}

// Register IPC handler for screenshot capture requests from renderer process.
ipcMain.handle('capture-screenshot', async (event, sessionPath) => {
  return await ScreenCapture.captureAndSave(sessionPath);
}); 