"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppState = void 0;
const electron_1 = require("electron");
const ipcHandlers_1 = require("./ipcHandlers");
const WindowHelper_1 = require("./WindowHelper");
const ScreenshotHelper_1 = require("./ScreenshotHelper");
const shortcuts_1 = require("./shortcuts");
const ProcessingHelper_1 = require("./ProcessingHelper");
const HotkeyListener_1 = require("./services/HotkeyListener");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class AppState {
    static instance = null;
    windowHelper;
    screenshotHelper;
    shortcutsHelper;
    processingHelper;
    // View management
    view = "queue";
    problemInfo = null; // Allow null
    hasDebugged = false;
    // Processing events
    PROCESSING_EVENTS = {
        //global states
        UNAUTHORIZED: "procesing-unauthorized",
        NO_SCREENSHOTS: "processing-no-screenshots",
        //states for generating the initial solution
        INITIAL_START: "initial-start",
        PROBLEM_EXTRACTED: "problem-extracted",
        SOLUTION_SUCCESS: "solution-success",
        INITIAL_SOLUTION_ERROR: "solution-error",
        //states for processing the debugging
        DEBUG_START: "debug-start",
        DEBUG_SUCCESS: "debug-success",
        DEBUG_ERROR: "debug-error"
    };
    constructor() {
        // Initialize WindowHelper with this
        this.windowHelper = new WindowHelper_1.WindowHelper(this);
        // Initialize ScreenshotHelper
        this.screenshotHelper = new ScreenshotHelper_1.ScreenshotHelper(this.view);
        // Initialize ProcessingHelper
        this.processingHelper = new ProcessingHelper_1.ProcessingHelper(this);
        // Initialize ShortcutsHelper
        this.shortcutsHelper = new shortcuts_1.ShortcutsHelper(this);
    }
    static getInstance() {
        if (!AppState.instance) {
            AppState.instance = new AppState();
        }
        return AppState.instance;
    }
    // Getters and Setters
    getMainWindow() {
        return this.windowHelper.getMainWindow();
    }
    getView() {
        return this.view;
    }
    setView(view) {
        this.view = view;
        this.screenshotHelper.setView(view);
    }
    isVisible() {
        return this.windowHelper.isVisible();
    }
    getScreenshotHelper() {
        return this.screenshotHelper;
    }
    getProblemInfo() {
        return this.problemInfo;
    }
    setProblemInfo(problemInfo) {
        this.problemInfo = problemInfo;
    }
    getScreenshotQueue() {
        return this.screenshotHelper.getScreenshotQueue();
    }
    getExtraScreenshotQueue() {
        return this.screenshotHelper.getExtraScreenshotQueue();
    }
    // Window management methods
    createWindow() {
        this.windowHelper.createWindow();
    }
    hideMainWindow() {
        this.windowHelper.hideMainWindow();
    }
    showMainWindow() {
        this.windowHelper.showMainWindow();
    }
    toggleMainWindow() {
        console.log("Screenshots: ", this.screenshotHelper.getScreenshotQueue().length, "Extra screenshots: ", this.screenshotHelper.getExtraScreenshotQueue().length);
        this.windowHelper.toggleMainWindow();
    }
    setWindowDimensions(width, height) {
        this.windowHelper.setWindowDimensions(width, height);
    }
    clearQueues() {
        this.screenshotHelper.clearQueues();
        // Clear problem info
        this.problemInfo = null;
        // Reset view to initial state
        this.setView("queue");
    }
    // Screenshot management methods
    async takeScreenshot() {
        if (!this.getMainWindow())
            throw new Error("No main window available");
        const screenshotPath = await this.screenshotHelper.takeScreenshot(() => this.hideMainWindow(), () => this.showMainWindow());
        return screenshotPath;
    }
    async getImagePreview(filepath) {
        return this.screenshotHelper.getImagePreview(filepath);
    }
    async deleteScreenshot(path) {
        return this.screenshotHelper.deleteScreenshot(path);
    }
    // New methods to move the window
    moveWindowLeft() {
        this.windowHelper.moveWindowLeft();
    }
    moveWindowRight() {
        this.windowHelper.moveWindowRight();
    }
    moveWindowDown() {
        this.windowHelper.moveWindowDown();
    }
    moveWindowUp() {
        this.windowHelper.moveWindowUp();
    }
    setHasDebugged(value) {
        this.hasDebugged = value;
    }
    getHasDebugged() {
        return this.hasDebugged;
    }
}
exports.AppState = AppState;
// Application initialization
async function initializeApp() {
    const appState = AppState.getInstance();
    // Initialize IPC handlers before window creation
    (0, ipcHandlers_1.initializeIpcHandlers)(appState);
    electron_1.app.whenReady().then(() => {
        console.log("App is ready");
        appState.createWindow();
        // Register global shortcuts using ShortcutsHelper
        appState.shortcutsHelper.registerGlobalShortcuts();
        const mainWindow = appState.getMainWindow();
        if (mainWindow) {
            HotkeyListener_1.HotkeyListener.registerShortcuts(mainWindow);
        }
    });
    electron_1.app.on("activate", () => {
        console.log("App activated");
        if (appState.getMainWindow() === null) {
            appState.createWindow();
        }
    });
    // Quit when all windows are closed, except on macOS
    electron_1.app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            electron_1.app.quit();
        }
    });
    electron_1.app.dock?.hide(); // Hide dock icon (optional)
    electron_1.app.commandLine.appendSwitch("disable-background-timer-throttling");
    // Path to the user's Documents/AI-Interview-Assistant directory
    const getSessionsRoot = () => path_1.default.join(electron_1.app.getPath('documents'), 'AI-Interview-Assistant');
    // Save a temp file (for resume upload)
    electron_1.ipcMain.handle('save-temp-file', async (_event, fileName, buffer) => {
        const tempDir = path_1.default.join(electron_1.app.getPath('temp'), 'ai-interview-assistant');
        if (!fs_1.default.existsSync(tempDir))
            fs_1.default.mkdirSync(tempDir, { recursive: true });
        const tempPath = path_1.default.join(tempDir, `${Date.now()}_${fileName}`);
        fs_1.default.writeFileSync(tempPath, buffer);
        return tempPath;
    });
    // Get current session path (for follow-up, etc.)
    let currentSessionPath = null;
    electron_1.ipcMain.handle('get-current-session-path', async () => {
        // For demo, just return the latest session folder
        const sessionsRoot = getSessionsRoot();
        if (!fs_1.default.existsSync(sessionsRoot))
            return '';
        const sessions = fs_1.default.readdirSync(sessionsRoot).filter(f => fs_1.default.statSync(path_1.default.join(sessionsRoot, f)).isDirectory());
        if (sessions.length === 0)
            return '';
        // Sort by folder creation time, descending
        const latest = sessions.map(f => ({
            name: f,
            time: fs_1.default.statSync(path_1.default.join(sessionsRoot, f)).ctimeMs
        })).sort((a, b) => b.time - a.time)[0];
        currentSessionPath = path_1.default.join(sessionsRoot, latest.name);
        return currentSessionPath;
    });
    // List all session folders
    electron_1.ipcMain.handle('list-sessions', async () => {
        const sessionsRoot = getSessionsRoot();
        if (!fs_1.default.existsSync(sessionsRoot))
            return [];
        return fs_1.default.readdirSync(sessionsRoot).filter(f => fs_1.default.statSync(path_1.default.join(sessionsRoot, f)).isDirectory());
    });
}
// Start the application
initializeApp().catch(console.error);
//# sourceMappingURL=main.js.map