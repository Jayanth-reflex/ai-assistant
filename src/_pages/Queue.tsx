import React, { useState, useEffect, useRef } from "react"
import { useQuery } from "react-query"
import ScreenshotQueue from "../components/Queue/ScreenshotQueue"
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastVariant,
  ToastMessage
} from "../components/ui/toast"
import QueueCommands from "../components/Queue/QueueCommands"

interface QueueProps {
  setView: React.Dispatch<React.SetStateAction<"queue" | "solutions" | "debug" | "settings">>
}

const isElectronAPIAvailable = typeof window !== 'undefined' && !!window.electronAPI;

const Queue: React.FC<QueueProps> = ({ setView }) => {
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<ToastMessage>({
    title: "",
    description: "",
    variant: "neutral"
  })

  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [tooltipHeight, setTooltipHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  const [textInput, setTextInput] = useState("")
  const [showTextInput, setShowTextInput] = useState(false)

  const { data: screenshots = [], refetch } = useQuery<Array<{ path: string; preview: string; type?: 'image' | 'audio' | 'text' | 'unknown' }>, Error>(
    ["screenshots"],
    async () => {
      try {
        if (!isElectronAPIAvailable) {
          console.error("Electron API is not available")
          showToast("Error", "Electron API is not available", "error")
          return []
        }
        const existing = await window.electronAPI.getScreenshots()
        return existing
      } catch (error) {
        console.error("Error loading screenshots:", error)
        showToast("Error", "Failed to load existing screenshots", "error")
        return []
      }
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: true,
      refetchOnMount: true
    }
  )

  const showToast = (
    title: string,
    description: string,
    variant: ToastVariant
  ) => {
    setToastMessage({ title, description, variant })
    setToastOpen(true)
  }

  const handleDeleteScreenshot = async (index: number) => {
    const screenshotToDelete = screenshots[index]

    try {
      if (!isElectronAPIAvailable) {
        console.error("Electron API is not available")
        showToast("Error", "Electron API is not available", "error")
        return
      }
      const response = await window.electronAPI.deleteScreenshot(
        screenshotToDelete.path
      )

      if (response.success) {
        refetch()
      } else {
        console.error("Failed to delete screenshot:", response.error)
        showToast("Error", "Failed to delete the screenshot file", "error")
      }
    } catch (error) {
      console.error("Error deleting screenshot:", error)
    }
  }

  // Add text input to queue
  const handleAddText = async () => {
    if (textInput.trim()) {
      try {
        if (!isElectronAPIAvailable) {
          console.error("Electron API is not available")
          showToast("Error", "Electron API is not available", "error")
          return
        }
        console.log("Adding text input:", textInput.trim())
        const fileName = `text_${Date.now()}.txt`;
        const textEncoder = new TextEncoder();
        const uint8Array = textEncoder.encode(textInput.trim());
        // Send Uint8Array directly
        const tempPath = await (window.electronAPI as any).saveTempFile(fileName, uint8Array);
        console.log("File saved to temp path:", tempPath)
        console.log("Adding file to queue...")
        await (window.electronAPI as any).addFileToQueue(tempPath);
        console.log("File added to queue successfully")
        setTextInput("")
        setShowTextInput(false)
        refetch()
      } catch (error) {
        console.error("Error adding text input:", error)
        showToast("Error", "Failed to add text input", "error")
      }
    }
  }

  useEffect(() => {
    const updateDimensions = () => {
      if (contentRef.current) {
        let contentHeight = contentRef.current.scrollHeight
        const contentWidth = contentRef.current.scrollWidth
        if (isTooltipVisible) {
          contentHeight += tooltipHeight
        }
        if (!isElectronAPIAvailable) {
          console.error("Electron API is not available")
          showToast("Error", "Electron API is not available", "error")
          return
        }
        window.electronAPI.updateContentDimensions({
          width: contentWidth,
          height: contentHeight
        })
      }
    }

    const resizeObserver = new ResizeObserver(updateDimensions)
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current)
    }
    updateDimensions()

    const cleanupFunctions = [
      window.electronAPI.onScreenshotTaken(() => refetch()),
      window.electronAPI.onResetView(() => refetch()),
      window.electronAPI.onSolutionStart(() => {
        showToast(
          "Processing",
          "Processing your request...",
          "neutral"
        )
      }),
      window.electronAPI.onSolutionError((error: string) => {
        showToast(
          "Processing Failed",
          "There was an error processing your screenshots.",
          "error"
        )
        setView("queue")
        console.error("Processing error:", error)
      })
    ]

    return () => {
      resizeObserver.disconnect()
      cleanupFunctions.forEach((cleanup) => cleanup())
    }
  }, [isTooltipVisible, tooltipHeight])

  const handleTooltipVisibilityChange = (visible: boolean, height: number) => {
    setIsTooltipVisible(visible)
    setTooltipHeight(height)
  }

  return (
    <div ref={contentRef} className={`bg-transparent w-1/2`}>
      <div className="px-4 py-3">
        <Toast
          open={toastOpen}
          onOpenChange={setToastOpen}
          variant={toastMessage.variant}
          duration={3000}
        >
          <ToastTitle>{toastMessage.title}</ToastTitle>
          <ToastDescription>{toastMessage.description}</ToastDescription>
        </Toast>

        {/* Text Input Modal/Popover */}
        {showTextInput && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col gap-4">
              <div className="text-base font-semibold text-gray-800">Type or paste a problem statement</div>
              <input
                className="flex-1 px-2 py-1 rounded border border-gray-300 text-sm"
                type="text"
                placeholder="Type or paste a problem statement..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddText() }}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs hover:bg-gray-300"
                  onClick={() => { setShowTextInput(false); setTextInput("") }}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
                  onClick={handleAddText}
                  disabled={!textInput.trim()}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3 w-fit">
          <ScreenshotQueue
            isLoading={false}
            screenshots={screenshots}
            onDeleteScreenshot={handleDeleteScreenshot}
          />
          <QueueCommands
            screenshots={screenshots}
            onTooltipVisibilityChange={handleTooltipVisibilityChange}
            setView={setView}
            onShowTextInput={() => setShowTextInput(true)}
          />
        </div>
      </div>
    </div>
  )
}

export default Queue
