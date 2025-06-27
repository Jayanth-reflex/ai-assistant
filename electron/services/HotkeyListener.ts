// HotkeyListener.ts
// Registers global hotkey for triggering actions
import { app, globalShortcut, ipcMain, BrowserWindow } from 'electron';

/**
 * HotkeyListener provides static methods to register and unregister global hotkeys for the app.
 */
export class HotkeyListener {
  /**
   * Registers global hotkeys for screenshot+OCR and AI processing/output.
   * @param mainWindow - The main Electron BrowserWindow to send IPC events to.
   */
  static registerShortcuts(mainWindow: BrowserWindow) {
    const isMac = process.platform === 'darwin';
    // Register screenshot + OCR hotkey (Cmd+H or Ctrl+H)
    globalShortcut.register(isMac ? 'Command+H' : 'Control+H', () => {
      mainWindow.webContents.send('hotkey-screenshot-ocr');
    });
    // Register AI processing/output hotkey (Cmd+Return or Ctrl+Enter)
    globalShortcut.register(isMac ? 'Command+Return' : 'Control+Enter', () => {
      mainWindow.webContents.send('hotkey-ai-process');
    });
  }
  /**
   * Unregisters all global hotkeys.
   */
  static unregisterAll() {
    globalShortcut.unregisterAll();
  }
}

// Example: Call HotkeyListener.registerShortcuts(mainWindow) in your main.ts after app is ready.
// Register IPC handler for dynamic hotkey registration (optional, not used in static version).
ipcMain.handle('register-hotkeys', async (event) => {
  // Not used in this static version, but could be extended for dynamic hotkeys
  return true;
}); 