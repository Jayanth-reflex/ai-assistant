// Solutions.tsx
import React, { useState, useEffect, useRef } from "react"
import { useQuery, useQueryClient } from "react-query"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"

import ScreenshotQueue from "../components/Queue/ScreenshotQueue"
import {
  Toast,
  ToastDescription,
  ToastMessage,
  ToastTitle,
  ToastVariant
} from "../components/ui/toast"
import { ProblemStatementData } from "../types/solutions"
import { AudioResult } from "../types/audio"
import SolutionCommands from "../components/Solutions/SolutionCommands"
import ScrollableContent from "../components/ScrollableContent/ScrollableContent"
import Debug from "./Debug"
import { preferencesManager } from "../lib/preferences"

// (Using global ElectronAPI type from src/types/electron.d.ts)

export const ContentSection = ({
  title,
  content,
  isLoading,
  fontColor
}: {
  title: string
  content: React.ReactNode
  isLoading: boolean
  fontColor?: string
}) => (
  <div className="space-y-2">
    <h2 className="text-[13px] font-medium text-white tracking-wide" style={fontColor ? { color: fontColor } : undefined}>
      {title}
    </h2>
    {isLoading ? (
      <div className="mt-4 flex">
        <p className="text-xs bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 bg-clip-text text-transparent animate-pulse">
          Extracting problem statement...
        </p>
      </div>
    ) : (
      <ScrollableContent maxHeight="400px">
        <div className="text-[13px] leading-[1.4] text-gray-100 max-w-[600px]" style={fontColor ? { color: fontColor } : undefined}>
          {content}
        </div>
      </ScrollableContent>
    )}
  </div>
)
const SolutionSection = ({
  title,
  content,
  isLoading
}: {
  title: string
  content: React.ReactNode
  isLoading: boolean
}) => (
  <div className="space-y-2">
    <h2 className="text-[13px] font-medium text-white tracking-wide">
      {title}
    </h2>
    {isLoading ? (
      <div className="space-y-1.5">
        <div className="mt-4 flex">
          <p className="text-xs bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 bg-clip-text text-transparent animate-pulse">
            Loading solutions...
          </p>
        </div>
      </div>
    ) : (
      <ScrollableContent maxHeight="400px">
        <div className="w-full">
          <SyntaxHighlighter
            showLineNumbers
            language="python"
            style={dracula}
            customStyle={{
              maxWidth: "100%",
              margin: 0,
              padding: "1rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all"
            }}
            wrapLongLines={true}
          >
            {content as string}
          </SyntaxHighlighter>
        </div>
      </ScrollableContent>
    )}
  </div>
)

export const ComplexitySection = ({
  timeComplexity,
  spaceComplexity,
  isLoading,
  fontColor
}: {
  timeComplexity: string | null
  spaceComplexity: string | null
  isLoading: boolean
  fontColor?: string
}) => (
  <div className="space-y-2">
    <h2 className="text-[13px] font-medium text-white tracking-wide" style={fontColor ? { color: fontColor } : undefined}>
      Complexity (Updated)
    </h2>
    {isLoading ? (
      <p className="text-xs bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 bg-clip-text text-transparent animate-pulse">
        Calculating complexity...
      </p>
    ) : (
      <div className="space-y-1">
        <div className="flex items-start gap-2 text-[13px] leading-[1.4] text-gray-100" style={fontColor ? { color: fontColor } : undefined}>
          <div className="w-1 h-1 rounded-full bg-blue-400/80 mt-2 shrink-0" />
          <div>
            <strong>Time:</strong> {timeComplexity}
          </div>
        </div>
        <div className="flex items-start gap-2 text-[13px] leading-[1.4] text-gray-100" style={fontColor ? { color: fontColor } : undefined}>
          <div className="w-1 h-1 rounded-full bg-blue-400/80 mt-2 shrink-0" />
          <div>
            <strong>Space:</strong> {spaceComplexity}
          </div>
        </div>
      </div>
    )}
  </div>
)

interface SolutionsProps {
  setView: React.Dispatch<React.SetStateAction<"queue" | "solutions" | "debug" | "settings">>
}
const Solutions: React.FC<SolutionsProps> = ({ setView }) => {
  const queryClient = useQueryClient()
  const contentRef = useRef<HTMLDivElement>(null)

  const [debugProcessing, setDebugProcessing] = useState(false)
  const [problemInfo, setProblemInfo] = useState<any>(null)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<ToastMessage>({
    title: "",
    description: "",
    variant: "neutral"
  })
  const [isResetting, setIsResetting] = useState(false)
  
  // Get current preferences
  const [preferences, setPreferences] = useState(preferencesManager.getPreferences())

  const { data: extraScreenshots = [], refetch } = useQuery<Array<{ path: string; preview: string }>, Error>(
    ["extras"],
    async () => {
      try {
        const existing = await window.electronAPI.getScreenshots()
        return existing
      } catch (error) {
        console.error("Error loading extra screenshots:", error)
        return []
      }
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity
    }
  )

  useEffect(() => {
    const cleanupFunctions = [
      window.electronAPI.onResetView(() => {
        setIsResetting(true)
        setProblemInfo(null)
        setTimeout(() => setIsResetting(false), 0)
      }),
      window.electronAPI.onProblemExtracted((data) => {
        setProblemInfo(data)
      })
    ]
    return () => cleanupFunctions.forEach((cleanup) => cleanup())
  }, [])

  // Update preferences when they change
  useEffect(() => {
    const interval = setInterval(() => {
      const currentPrefs = preferencesManager.getPreferences()
      if (JSON.stringify(currentPrefs) !== JSON.stringify(preferences)) {
        setPreferences(currentPrefs)
      }
    }, 1000) // Check every second for preference changes

    return () => clearInterval(interval)
  }, [preferences])

  const handleCopy = () => {
    if (problemInfo?.problem_statement) {
      navigator.clipboard.writeText(problemInfo.problem_statement)
      setToastMessage({ title: "Copied!", description: "Response copied to clipboard.", variant: "neutral" })
      setToastOpen(true)
    }
  }

  // Get dynamic styles based on preferences
  const getResponseStyles = () => {
    const bgStyle = preferencesManager.getResponseBackgroundStyle()
    const fontColor = preferencesManager.getResponseFontColor()
    
    // Debug logging
    console.log('Solutions - Background style:', bgStyle)
    console.log('Solutions - Font color:', fontColor)
    
    return {
      backgroundColor: bgStyle,
      color: fontColor
    }
  }

  return (
    <div ref={contentRef} className="relative space-y-3 px-4 py-3">
      <Toast
        open={toastOpen}
        onOpenChange={setToastOpen}
        variant={toastMessage.variant}
        duration={2000}
      >
        <ToastTitle>{toastMessage.title}</ToastTitle>
        <ToastDescription>{toastMessage.description}</ToastDescription>
      </Toast>
      {!isResetting && problemInfo && (
        <div 
          className="w-full max-w-2xl mx-auto rounded-lg shadow-lg p-4 relative"
          style={getResponseStyles()}
        >
          {/* Input tags */}
          <div className="flex gap-2 mb-2">
            {problemInfo.input_types?.includes('screenshot') && (
              <span className="px-2 py-0.5 rounded bg-blue-600/80 text-white/90 text-[10px]">Screenshot</span>
            )}
            {problemInfo.input_types?.includes('audio') && (
              <span className="px-2 py-0.5 rounded bg-green-600/80 text-white/90 text-[10px]">Voice</span>
            )}
            {problemInfo.input_types?.includes('text') && (
              <span className="px-2 py-0.5 rounded bg-purple-600/80 text-white/90 text-[10px]">Text</span>
            )}
          </div>
          {/* Copy button */}
          <button
            className="absolute top-4 right-4 px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded"
            style={{ color: preferences.responseFontColor }}
            onClick={handleCopy}
            title="Copy response"
          >
            Copy
          </button>
          {/* Scrollable response */}
          <ScrollableContent maxHeight="500px">
            <div className="rounded-lg overflow-hidden">
              <div className="px-2 py-2 space-y-4 max-w-full">
                <div 
                  className="text-[13px] leading-[1.4] max-w-[600px] whitespace-pre-wrap"
                  style={{ color: preferences.responseFontColor }}
                >
                  {problemInfo.problem_statement}
                </div>
              </div>
            </div>
          </ScrollableContent>
        </div>
      )}
    </div>
  )
}

export default Solutions
