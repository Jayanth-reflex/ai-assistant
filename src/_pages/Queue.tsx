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
  const [shouldRenderModal, setShouldRenderModal] = useState(false)

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

  // Handle clicking outside modal to close it
  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowTextInput(false)
      setTextInput("")
    }
  }

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showTextInput) {
        setShowTextInput(false)
        setTextInput("")
      }
    }

    if (showTextInput) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [showTextInput])

  // Handle modal rendering with a small delay
  useEffect(() => {
    if (showTextInput) {
      const timer = setTimeout(() => {
        setShouldRenderModal(true)
      }, 50)
      return () => {
        clearTimeout(timer)
        setShouldRenderModal(false)
      }
    } else {
      setShouldRenderModal(false)
    }
  }, [showTextInput])

  return (
    <>
      {/* Debug log */}
      {console.log("Rendering Queue component, showTextInput:", showTextInput, "shouldRenderModal:", shouldRenderModal)}
      
      {/* Text Input Modal - Simple overlay approach */}
      {showTextInput && shouldRenderModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={handleModalBackdropClick}
        >
          <div 
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '15px',
              width: '300px',
              maxWidth: '90vw',
              color: 'white'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              style={{
                width: '100%',
                padding: '7px',
                borderRadius: '4px',
                border: '1px solid #555',
                backgroundColor: '#2a2a2a',
                color: 'white',
                fontSize: '12px',
                marginBottom: '10px',
                outline: 'none',
                height: '28px',
                boxSizing: 'border-box'
              }}
              placeholder="Type or paste a problem statement..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddText();
                }
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
              <button
                style={{
                  padding: '4px 8px',
                  borderRadius: '3px',
                  border: 'none',
                  backgroundColor: '#555',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '10px',
                  height: '24px',
                  minWidth: '50px'
                }}
                onClick={() => { setShowTextInput(false); setTextInput("") }}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: '4px 8px',
                  borderRadius: '3px',
                  border: 'none',
                  backgroundColor: textInput.trim() ? '#007acc' : '#555',
                  color: 'white',
                  cursor: textInput.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '10px',
                  height: '24px',
                  minWidth: '40px'
                }}
                onClick={handleAddText}
                disabled={!textInput.trim()}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

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
              onShowTextInput={() => {
                console.log("Text input button clicked, setting showTextInput to true");
                setShowTextInput(true);
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Queue
