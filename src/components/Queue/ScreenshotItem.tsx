// src/components/ScreenshotItem.tsx
import React from "react"
import { X } from "lucide-react"

interface Screenshot {
  path: string
  preview: string
  type?: 'image' | 'audio' | 'text' | 'unknown'
}

interface ScreenshotItemProps {
  screenshot: Screenshot
  onDelete: (index: number) => void
  index: number
  isLoading: boolean
}

const ScreenshotItem: React.FC<ScreenshotItemProps> = ({
  screenshot,
  onDelete,
  index,
  isLoading
}) => {
  const handleDelete = async () => {
    await onDelete(index)
  }

  return (
    <>
      <div
        className={`border border-white relative ${isLoading ? "" : "group"}`}
      >
        <div className="w-full h-full relative">
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          {screenshot.type === 'image' || !screenshot.type ? (
            // Image files - display as image
            <img
              src={screenshot.preview}
              alt="Screenshot"
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isLoading
                  ? "opacity-50"
                  : "cursor-pointer group-hover:scale-105 group-hover:brightness-75"
              }`}
            />
          ) : (
            // Audio/Text files - display as icon with label
            <div className={`w-full h-full flex flex-col items-center justify-center bg-gray-800 transition-transform duration-300 ${
              isLoading
                ? "opacity-50"
                : "cursor-pointer group-hover:scale-105 group-hover:brightness-75"
            }`}>
              <img
                src={screenshot.preview}
                alt={screenshot.type}
                className="w-8 h-8 mb-2"
              />
              <span className="text-xs text-white/70 capitalize">
                {screenshot.type}
              </span>
            </div>
          )}
        </div>
        
        {!isLoading && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            className="absolute top-2 left-2 p-1 rounded-full bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Delete screenshot"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </>
  )
}

export default ScreenshotItem
