export interface UserPreferences {
  responseBackgroundColor: string
  responseFontColor: string
  responseBackgroundOpacity: number
}

const DEFAULT_PREFERENCES: UserPreferences = {
  responseBackgroundColor: '#000000',
  responseFontColor: '#e5e7eb', // gray-100
  responseBackgroundOpacity: 50
}

const PREFERENCES_KEY = 'ai-interview-assistant-preferences'

export class PreferencesManager {
  private static instance: PreferencesManager | null = null
  private preferences: UserPreferences

  private constructor() {
    this.preferences = this.loadPreferences()
  }

  public static getInstance(): PreferencesManager {
    if (!PreferencesManager.instance) {
      PreferencesManager.instance = new PreferencesManager()
    }
    return PreferencesManager.instance
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return { ...DEFAULT_PREFERENCES, ...parsed }
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    }
    return { ...DEFAULT_PREFERENCES }
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(this.preferences))
    } catch (error) {
      console.error('Error saving preferences:', error)
    }
  }

  public getPreferences(): UserPreferences {
    return { ...this.preferences }
  }

  public updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates }
    this.savePreferences()
  }

  public resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES }
    this.savePreferences()
  }

  public getResponseBackgroundStyle(): string {
    const { responseBackgroundColor, responseBackgroundOpacity } = this.preferences
    const opacity = responseBackgroundOpacity / 100
    
    // Convert hex to rgba for proper opacity handling
    const hex = responseBackgroundColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  public getResponseFontColor(): string {
    return this.preferences.responseFontColor
  }

  // Debug method to log current preferences
  public debugPreferences(): void {
    console.log('Current preferences:', this.preferences)
    console.log('Background style:', this.getResponseBackgroundStyle())
    console.log('Font color:', this.getResponseFontColor())
  }
}

export const preferencesManager = PreferencesManager.getInstance() 