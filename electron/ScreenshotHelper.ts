/**
 * @file ScreenshotHelper.ts
 * @description
 *   Manages screenshot capture, storage, queueing, and image format conversion for the UAT AI Meetings Assistant. Handles both main and extra screenshot queues, JPEG optimization, and file management for multi-modal interview input processing.
 *
 * Architecture Role:
 *   - Provides screenshot capture and queue management for the Electron app.
 *   - Handles JPEG conversion and file cleanup for efficient storage and processing.
 *   - Supports both main and extra (debug) screenshot workflows.
 *
 * Usage:
 *   Instantiate and use public methods to capture, preview, delete, and manage screenshots and related files.
 *
 * @author UAT
 * @copyright MIT
 */

import path from "node:path"
import fs from "node:fs"
import { app } from "electron"
import { v4 as uuidv4 } from "uuid"
import screenshot from "screenshot-desktop"
import sharp from "sharp"

export class ScreenshotHelper {
  /**
   * Queue of screenshot file paths for the main workflow.
   * @private
   */
  private screenshotQueue: string[] = []
  /**
   * Queue of extra screenshot file paths for debug workflow.
   * @private
   */
  private extraScreenshotQueue: string[] = []
  /**
   * Maximum number of screenshots allowed in each queue.
   * @private
   * @readonly
   */
  private readonly MAX_SCREENSHOTS = 5

  /**
   * Directory path for main screenshots.
   * @private
   * @readonly
   */
  private readonly screenshotDir: string
  /**
   * Directory path for extra (debug) screenshots.
   * @private
   * @readonly
   */
  private readonly extraScreenshotDir: string

  /**
   * Current view mode (queue or solutions).
   * @private
   */
  private view: "queue" | "solutions" = "queue"

  constructor(view: "queue" | "solutions" = "queue") {
    this.view = view

    // Initialize directories
    this.screenshotDir = path.join(app.getPath("userData"), "screenshots")
    this.extraScreenshotDir = path.join(
      app.getPath("userData"),
      "extra_screenshots"
    )

    // Create directories if they don't exist
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir)
    }
    if (!fs.existsSync(this.extraScreenshotDir)) {
      fs.mkdirSync(this.extraScreenshotDir)
    }
  }

  public getView(): "queue" | "solutions" {
    return this.view
  }

  public setView(view: "queue" | "solutions"): void {
    this.view = view
  }

  public getScreenshotQueue(): string[] {
    return this.screenshotQueue
  }

  public getExtraScreenshotQueue(): string[] {
    return this.extraScreenshotQueue
  }

  public clearQueues(): void {
    // Clear screenshotQueue
    this.screenshotQueue.forEach((screenshotPath) => {
      fs.unlink(screenshotPath, (err) => {
        if (err)
          console.error(`Error deleting screenshot at ${screenshotPath}:`, err)
      })
    })
    this.screenshotQueue = []

    // Clear extraScreenshotQueue
    this.extraScreenshotQueue.forEach((screenshotPath) => {
      fs.unlink(screenshotPath, (err) => {
        if (err)
          console.error(
            `Error deleting extra screenshot at ${screenshotPath}:`,
            err
          )
      })
    })
    this.extraScreenshotQueue = []
  }

  public async takeScreenshot(
    hideMainWindow: () => void,
    showMainWindow: () => void
  ): Promise<string> {
    hideMainWindow()
    let screenshotPath = ""
    let jpegPath = ""

    if (this.view === "queue") {
      screenshotPath = path.join(this.screenshotDir, `${uuidv4()}.png`)
      jpegPath = screenshotPath.replace(/\.png$/, ".jpg")
      await screenshot({ filename: screenshotPath })
      // Convert PNG to JPEG using sharp
      try {
        await sharp(screenshotPath)
          .jpeg({ quality: 95 })
          .toFile(jpegPath)
        await fs.promises.unlink(screenshotPath)
        screenshotPath = jpegPath
      } catch (err) {
        console.error("Error converting screenshot to JPEG:", err)
        // Fallback: use PNG if JPEG conversion fails
      }
      this.screenshotQueue.push(screenshotPath)
      if (this.screenshotQueue.length > this.MAX_SCREENSHOTS) {
        const removedPath = this.screenshotQueue.shift()
        if (removedPath) {
          try {
            await fs.promises.unlink(removedPath)
          } catch (error) {
            console.error("Error removing old screenshot:", error)
          }
        }
      }
    } else {
      screenshotPath = path.join(this.extraScreenshotDir, `${uuidv4()}.png`)
      jpegPath = screenshotPath.replace(/\.png$/, ".jpg")
      await screenshot({ filename: screenshotPath })
      // Convert PNG to JPEG using sharp
      try {
        await sharp(screenshotPath)
          .jpeg({ quality: 95 })
          .toFile(jpegPath)
        await fs.promises.unlink(screenshotPath)
        screenshotPath = jpegPath
      } catch (err) {
        console.error("Error converting screenshot to JPEG:", err)
        // Fallback: use PNG if JPEG conversion fails
      }
      this.extraScreenshotQueue.push(screenshotPath)
      if (this.extraScreenshotQueue.length > this.MAX_SCREENSHOTS) {
        const removedPath = this.extraScreenshotQueue.shift()
        if (removedPath) {
          try {
            await fs.promises.unlink(removedPath)
          } catch (error) {
            console.error("Error removing old screenshot:", error)
          }
        }
      }
    }

    showMainWindow()
    return screenshotPath
  }

  public async getImagePreview(filepath: string): Promise<string> {
    try {
      const ext = path.extname(filepath).toLowerCase()
      const data = await fs.promises.readFile(filepath)
      if (ext === ".jpg" || ext === ".jpeg") {
        return `data:image/jpeg;base64,${data.toString("base64")}`
      } else if (ext === ".png") {
        return `data:image/png;base64,${data.toString("base64")}`
      } else {
        // fallback for unknown types
        return `data:application/octet-stream;base64,${data.toString("base64")}`
      }
    } catch (error) {
      console.error("Error reading image:", error)
      throw error
    }
  }

  public async deleteScreenshot(
    path: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await fs.promises.unlink(path)
      if (this.view === "queue") {
        this.screenshotQueue = this.screenshotQueue.filter(
          (filePath) => filePath !== path
        )
      } else {
        this.extraScreenshotQueue = this.extraScreenshotQueue.filter(
          (filePath) => filePath !== path
        )
      }
      return { success: true }
    } catch (error) {
      console.error("Error deleting file:", error)
      return { success: false, error: error.message }
    }
  }

  // Add a file to the screenshot queue (for voice recordings and text input)
  public addFileToQueue(filePath: string): void {
    const fileName = path.basename(filePath)
    let newPath = filePath
    
    // If file is in temp directory, move it to screenshot directory
    if (filePath.includes('ai-interview-assistant')) {
      if (this.view === "queue") {
        newPath = path.join(this.screenshotDir, fileName)
      } else {
        newPath = path.join(this.extraScreenshotDir, fileName)
      }
      
      try {
        // Move file from temp to screenshot directory
        fs.renameSync(filePath, newPath)
      } catch (error) {
        console.error("Error moving file from temp to screenshot directory:", error)
        // If move fails, just use the original path
        newPath = filePath
      }
    }
    
    if (this.view === "queue") {
      this.screenshotQueue.push(newPath)
      if (this.screenshotQueue.length > this.MAX_SCREENSHOTS) {
        const removedPath = this.screenshotQueue.shift()
        if (removedPath) {
          try {
            fs.unlinkSync(removedPath)
          } catch (error) {
            console.error("Error removing old file:", error)
          }
        }
      }
    } else {
      this.extraScreenshotQueue.push(newPath)
      if (this.extraScreenshotQueue.length > this.MAX_SCREENSHOTS) {
        const removedPath = this.extraScreenshotQueue.shift()
        if (removedPath) {
          try {
            fs.unlinkSync(removedPath)
          } catch (error) {
            console.error("Error removing old file:", error)
          }
        }
      }
    }
  }
}
