/**
 * @file ipcHandlers.ts
 * @description
 *   Registers and manages all IPC handlers for the UAT AI Meetings Assistant. Handles communication between the renderer and main process for screenshots, audio, image, session, and configuration management.
 *
 * Architecture Role:
 *   - Centralizes all IPC handler registration for Electron main process.
 *   - Integrates with AppState for stateful operations and event propagation.
 *   - Handles all major app workflows via IPC (screenshots, audio, config, session, etc).
 *
 * Usage:
 *   Call `initializeIpcHandlers(appState)` during app startup to register all handlers.
 *
 * @author UAT
 * @copyright MIT
 */

import { ipcMain, app } from "electron"
import { AppState } from "./main"
import fs from 'fs'
import path from 'path'

export function initializeIpcHandlers(appState: AppState): void {
  ipcMain.handle(
    "update-content-dimensions",
    async (event, { width, height }: { width: number; height: number }) => {
      if (width && height) {
        appState.setWindowDimensions(width, height)
      }
    }
  )

  ipcMain.handle("delete-screenshot", async (event, path: string) => {
    return appState.deleteScreenshot(path)
  })

  ipcMain.handle("take-screenshot", async () => {
    try {
      const screenshotPath = await appState.takeScreenshot()
      const preview = await appState.getImagePreview(screenshotPath)
      return { path: screenshotPath, preview }
    } catch (error) {
      console.error("Error taking screenshot:", error)
      return { success: false, error: error.message || String(error) }
    }
  })

  ipcMain.handle("get-screenshots", async () => {
    console.log({ view: appState.getView() })
    try {
      let files = []
      if (appState.getView() === "queue") {
        files = appState.getScreenshotQueue()
      } else {
        files = appState.getExtraScreenshotQueue()
      }
      
      const previews = await Promise.all(
        files.map(async (filePath) => {
          const ext = path.extname(filePath).toLowerCase()
          
          if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
            // Image files - get actual preview
            const preview = await appState.getImagePreview(filePath)
            return { path: filePath, preview, type: 'image' }
          } else if (ext === '.mp3' || ext === '.wav') {
            // Audio files - return audio icon
            return { 
              path: filePath, 
              preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzM0MzQzNCIvPgo8cGF0aCBkPSJNMzIgMTZWMzJIMjRWMjBIMzJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzIgNDRWMzJIMjRWMjBIMzJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzIgNDRWMzJIMjRWMjBIMzJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K', 
              type: 'audio' 
            }
          } else if (ext === '.txt') {
            // Text files - return text icon
            return { 
              path: filePath, 
              preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzM0MzQzNCIvPgo8cGF0aCBkPSJNMjAgMjBIMzRWMjRIMjBWMjBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjAgMjhIMzRWMzJIMjBWMjhaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjAgMzZIMzRWMzBIMjBWMzZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K', 
              type: 'text' 
            }
          } else {
            // Unknown file type - return generic icon
            return { 
              path: filePath, 
              preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzM0MzQzNCIvPgo8cGF0aCBkPSJNMzIgMTZWMzJIMjRWMjBIMzJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K', 
              type: 'unknown' 
            }
          }
        })
      )
      
      previews.forEach((preview: any) => console.log(preview.path))
      return previews
    } catch (error) {
      console.error("Error getting screenshots:", error)
      return { success: false, error: error.message || String(error) }
    }
  })

  ipcMain.handle("toggle-window", async () => {
    appState.toggleMainWindow()
  })

  ipcMain.handle("reset-queues", async () => {
    try {
      appState.clearQueues()
      console.log("Screenshot queues have been cleared.")
      return { success: true }
    } catch (error: any) {
      console.error("Error resetting queues:", error)
      return { success: false, error: error.message || String(error) }
    }
  })

  // IPC handler for analyzing audio from base64 data
  ipcMain.handle("analyze-audio-base64", async (event, data: string, mimeType: string) => {
    try {
      const result = await appState.processingHelper.processAudioBase64(data, mimeType)
      return result
    } catch (error: any) {
      console.error("Error in analyze-audio-base64 handler:", error)
      return { success: false, error: error.message || String(error) }
    }
  })

  // IPC handler for analyzing audio from file path
  ipcMain.handle("analyze-audio-file", async (event, path: string) => {
    try {
      const result = await appState.processingHelper.processAudioFile(path)
      return result
    } catch (error: any) {
      console.error("Error in analyze-audio-file handler:", error)
      return { success: false, error: error.message || String(error) }
    }
  })

  // IPC handler for analyzing image from file path
  ipcMain.handle("analyze-image-file", async (event, path: string) => {
    try {
      const llmHelper = await appState.processingHelper.getLLMHelper()
      const result = await llmHelper.analyzeImageFile(path)
      return result
    } catch (error: any) {
      console.error("Error in analyze-image-file handler:", error)
      return { success: false, error: error.message || String(error) }
    }
  })

  // Gemini API Key config path
  const configPath = path.join(app.getPath('userData'), 'config.json')

  ipcMain.handle('get-gemini-api-key', async () => {
    try {
      if (fs.existsSync(configPath)) {
        const config: Record<string, any> = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        return config.apiKey || ''
      }
      return ''
    } catch (e) {
      return ''
    }
  })

  ipcMain.handle('set-gemini-api-key', async (event, key: string) => {
    try {
      let config: Record<string, any> = {}
      if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      }
      config.apiKey = key
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
      return
    } catch (e) {
      throw e
    }
  })

  ipcMain.handle("quit-app", () => {
    app.quit()
  })

  // IPC handler for adding files to the screenshot queue
  ipcMain.handle("add-file-to-queue", async (event, filePath: string) => {
    try {
      console.log("add-file-to-queue called with path:", filePath)
      appState.addFileToQueue(filePath)
      console.log("File added to queue successfully")
      return { success: true }
    } catch (error: any) {
      console.error("Error adding file to queue:", error)
      return { success: false, error: error.message || String(error) }
    }
  })
}
