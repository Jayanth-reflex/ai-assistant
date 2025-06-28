import React, { useState, useEffect, useRef } from "react"
import { IoLogOutOutline } from "react-icons/io5"
import { useQueryClient } from "react-query"
import { Toast, ToastTitle, ToastDescription } from "../ui/toast"

interface QueueCommandsProps {
  onTooltipVisibilityChange: (visible: boolean, height: number) => void
  screenshots: Array<{ path: string; preview: string; type?: 'image' | 'audio' | 'text' | 'unknown' }>
  setView?: React.Dispatch<React.SetStateAction<'queue' | 'solutions' | 'debug' | 'settings'>>
  onShowTextInput?: () => void
}

const isElectronAPIAvailable = typeof window !== 'undefined' && !!window.electronAPI;

const QueueCommands: React.FC<QueueCommandsProps> = ({
  onTooltipVisibilityChange,
  screenshots,
  setView,
  onShowTextInput
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [toast, setToast] = useState<{ show: boolean; title: string; description: string; variant: 'success' | 'error' | 'neutral' }>({
    show: false,
    title: '',
    description: '',
    variant: 'neutral'
  })
  const chunks = useRef<Blob[]>([])
  const queryClient = useQueryClient();

  useEffect(() => {
    let tooltipHeight = 0
    if (tooltipRef.current && isTooltipVisible) {
      tooltipHeight = tooltipRef.current.offsetHeight + 10
    }
    onTooltipVisibilityChange(isTooltipVisible, tooltipHeight)
  }, [isTooltipVisible])

  // Cleanup effect to ensure media streams are released
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop()
      }
    }
  }, [mediaRecorder])

  const handleMouseEnter = () => {
    setIsTooltipVisible(true)
  }

  const handleMouseLeave = () => {
    setIsTooltipVisible(false)
  }

  const handleRecordClick = async () => {
    if (!isRecording) {
      try {
        if (!isElectronAPIAvailable) {
          console.error("Electron API is not available")
          showToast("Electron API Error", "Electron API is not available", 'error')
          return
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)
        chunks.current = []
        
        recorder.ondataavailable = (e) => chunks.current.push(e.data)
        
        // Add a timeout to ensure recording doesn't hang
        const recordingTimeout = setTimeout(() => {
          if (recorder.state === 'recording') {
            console.log("Recording timeout reached, stopping recording")
            recorder.stop()
          }
        }, 300000) // 5 minutes timeout
        
        recorder.onstop = async () => {
          clearTimeout(recordingTimeout)
          console.log("Recording stopped, processing audio...")
          try {
          const blob = new Blob(chunks.current, { type: chunks.current[0]?.type || 'audio/webm' })
          chunks.current = []
          const arrayBuffer = await blob.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          const fileName = `audio_${Date.now()}.mp3`;
          console.log("Saving audio file:", fileName)
            
          // Send Uint8Array directly
          const tempPath = await (window.electronAPI as any).saveTempFile(fileName, uint8Array);
          console.log("Audio file saved to temp path:", tempPath)
          console.log("Adding audio file to queue...")
            
            const result = await (window.electronAPI as any).addFileToQueue(tempPath);
            if (result.success) {
          console.log("Audio file added to queue successfully")
          queryClient.invalidateQueries(["screenshots"]);
            } else {
              console.error("Failed to add audio file to queue:", result.error)
              showToast("Audio File Addition Error", result.error, 'error')
            }
          } catch (error) {
            console.error("Error processing audio:", error)
            showToast("Audio Processing Error", error instanceof Error ? error.message : "Unknown error occurred", 'error')
          } finally {
            // Always stop all tracks to release microphone
            stream.getTracks().forEach(track => {
              track.stop()
              console.log("Audio track stopped:", track.kind)
            })
          }
        }
        
        recorder.onerror = (event) => {
          clearTimeout(recordingTimeout)
          console.error("Recording error:", event)
          stream.getTracks().forEach(track => track.stop())
          setIsRecording(false)
          setMediaRecorder(null)
          showToast("Recording Error", event.message, 'error')
        }
        
        setMediaRecorder(recorder)
        recorder.start()
        setIsRecording(true)
      } catch (err) {
        console.error("Error starting recording:", err)
        // Show user-friendly error message
        showToast("Recording Error", "Failed to start recording. Please check microphone permissions.", 'error')
      }
    } else {
      if (mediaRecorder) {
        mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
      }
    }
  }

  const showToast = (title: string, description: string, variant: 'success' | 'error' | 'neutral' = 'neutral') => {
    setToast({ show: true, title, description, variant })
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000)
  }

  return (
    <div className="pt-2 w-fit">
      <div className="text-xs text-white/90 backdrop-blur-md bg-black/60 rounded-lg py-2 px-4 flex items-center justify-center gap-4">
        {/* Show/Hide */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] leading-none">Show/Hide</span>
          <div className="flex gap-1">
            <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-md px-1.5 py-1 text-[11px] leading-none text-white/70">
              ⌘
            </button>
            <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-md px-1.5 py-1 text-[11px] leading-none text-white/70">
              B
            </button>
          </div>
        </div>

        {/* Screenshot */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] leading-none truncate">
            {screenshots.length === 0 ? "Take first screenshot" : "Screenshot"}
          </span>
          <div className="flex gap-1">
            <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-md px-1.5 py-1 text-[11px] leading-none text-white/70">
              ⌘
            </button>
            <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-md px-1.5 py-1 text-[11px] leading-none text-white/70">
              H
            </button>
          </div>
        </div>

        {/* Solve Command */}
        {screenshots.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] leading-none">Solve</span>
            <div className="flex gap-1">
              <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-md px-1.5 py-1 text-[11px] leading-none text-white/70">
                ⌘
              </button>
              <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-md px-1.5 py-1 text-[11px] leading-none text-white/70">
                ↵
              </button>
            </div>
          </div>
        )}

        {/* Voice Recording Button */}
        <div className="flex items-center gap-2">
          <button
            className={`bg-white/10 hover:bg-white/20 transition-colors rounded-md px-2 py-1 text-[11px] leading-none text-white/70 flex items-center gap-1 ${isRecording ? 'bg-red-500/70 hover:bg-red-500/90 animate-pulse' : ''}`}
            onClick={handleRecordClick}
            type="button"
            title={isRecording ? "Click to stop recording" : "Click to start voice recording"}
          >
            {isRecording ? (
              <>
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                Stop Recording
              </>
            ) : (
              <>
                <span role="img" aria-label="microphone">🎤</span>
                Record Voice
              </>
            )}
          </button>
          {/* Text Input Button */}
          <button
            className="bg-white/10 hover:bg-white/20 transition-colors rounded-md px-2 py-1 text-[11px] leading-none text-white/70 flex items-center gap-1"
            onClick={() => onShowTextInput && onShowTextInput()}
            type="button"
            title="Text Input"
          >
            <span role="img" aria-label="text">📝</span> Text Input
          </button>
          {/* Settings Button */}
          <button
            className="bg-white/10 hover:bg-white/20 transition-colors rounded-md px-2 py-1 text-[11px] leading-none text-white/70 flex items-center gap-1"
            onClick={() => setView && setView('settings')}
            type="button"
            title="Settings"
          >
            <span role="img" aria-label="settings">⚙️</span> Settings
          </button>
        </div>

        {/* Question mark with tooltip */}
        <div
          className="relative inline-block"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors flex items-center justify-center cursor-help z-10">
            <span className="text-xs text-white/70">?</span>
          </div>

          {/* Tooltip Content */}
          {isTooltipVisible && (
            <div
              ref={tooltipRef}
              className="absolute top-full right-0 mt-2 w-80"
            >
              <div className="p-3 text-xs bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-white/90 shadow-lg">
                <div className="space-y-4">
                  <h3 className="font-medium truncate">Keyboard Shortcuts</h3>
                  <div className="space-y-3">
                    {/* Toggle Command */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate">Toggle Window</span>
                        <div className="flex gap-1 flex-shrink-0">
                          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            ⌘
                          </span>
                          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            B
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] leading-relaxed text-white/70 truncate">
                        Show or hide this window.
                      </p>
                    </div>
                    {/* Screenshot Command */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate">Take Screenshot</span>
                        <div className="flex gap-1 flex-shrink-0">
                          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            ⌘
                          </span>
                          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            H
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] leading-relaxed text-white/70 truncate">
                        Take a screenshot of the problem description. The tool
                        will extract and analyze the problem. The 5 latest
                        screenshots are saved.
                      </p>
                    </div>

                    {/* Solve Command */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate">Solve Problem</span>
                        <div className="flex gap-1 flex-shrink-0">
                          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            ⌘
                          </span>
                          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            ↵
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] leading-relaxed text-white/70 truncate">
                        Generate a solution based on the current problem.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="mx-2 h-4 w-px bg-white/20" />

        {/* Toast Notification */}
        {toast.show && (
          <Toast variant={toast.variant} className="fixed top-4 right-4 z-50">
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
          </Toast>
        )}

        {/* Sign Out Button - Moved to end */}
        <button
          className="text-red-500/70 hover:text-red-500/90 transition-colors hover:cursor-pointer"
          title="Sign Out"
          onClick={() => window.electronAPI.quitApp()}
        >
          <IoLogOutOutline className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default QueueCommands
