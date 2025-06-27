"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotkeyListener = void 0;
// HotkeyListener.ts
// Registers global hotkey for triggering actions
const electron_1 = require("electron");
/**
 * HotkeyListener provides static methods to register and unregister global hotkeys for the app.
 */
class HotkeyListener {
    /**
     * Registers global hotkeys for screenshot+OCR and AI processing/output.
     * @param mainWindow - The main Electron BrowserWindow to send IPC events to.
     */
    static registerShortcuts(mainWindow) {
        const isMac = process.platform === 'darwin';
        // Register screenshot + OCR hotkey (Cmd+H or Ctrl+H)
        electron_1.globalShortcut.register(isMac ? 'Command+H' : 'Control+H', () => {
            mainWindow.webContents.send('hotkey-screenshot-ocr');
        });
        // Register AI processing/output hotkey (Cmd+Return or Ctrl+Enter)
        electron_1.globalShortcut.register(isMac ? 'Command+Return' : 'Control+Enter', () => {
            mainWindow.webContents.send('hotkey-ai-process');
        });
    }
    /**
     * Unregisters all global hotkeys.
     */
    static unregisterAll() {
        electron_1.globalShortcut.unregisterAll();
    }
}
exports.HotkeyListener = HotkeyListener;
// Example: Call HotkeyListener.registerShortcuts(mainWindow) in your main.ts after app is ready.
// Register IPC handler for dynamic hotkey registration (optional, not used in static version).
electron_1.ipcMain.handle('register-hotkeys', async (event) => {
    // Not used in this static version, but could be extended for dynamic hotkeys
    return true;
});
//# sourceMappingURL=HotkeyListener.js.map