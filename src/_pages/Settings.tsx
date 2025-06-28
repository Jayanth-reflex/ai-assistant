import React, { useEffect, useState } from "react"
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastVariant,
  ToastMessage
} from "../components/ui/toast"

interface SettingsProps {
  setView: React.Dispatch<React.SetStateAction<'queue' | 'solutions' | 'debug' | 'settings'>>
}

const Settings: React.FC<SettingsProps> = ({ setView }) => {
  const [apiKey, setApiKey] = useState("")
  const [status, setStatus] = useState<null | "success" | "error">(null)
  const [toastMessage, setToastMessage] = useState<ToastMessage>({
    title: "",
    description: "",
    variant: "neutral"
  })
  const [toastOpen, setToastOpen] = useState(false)

  useEffect(() => {
    ;(window.electronAPI as any)?.getGeminiApiKey?.().then((key: string) => {
      setApiKey(key)
    })
  }, [])

  const handleSave = async () => {
    try {
      await (window.electronAPI as any)?.setGeminiApiKey?.(apiKey)
      setToastMessage({
        title: "Success",
        description: "API key saved successfully",
        variant: "success"
      })
      setToastOpen(true)
      setTimeout(() => {
        setView("queue")
      }, 1500)
    } catch (error) {
      setToastMessage({
        title: "Error",
        description: "Failed to save API key",
        variant: "error"
      })
      setToastOpen(true)
    }
  }

  return (
    <div style={{
      padding: '15px',
      maxWidth: '300px',
      margin: '0 auto',
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '8px',
      color: 'white'
    }}>
      <Toast
        open={toastOpen}
        onOpenChange={setToastOpen}
        variant={toastMessage.variant}
        duration={3000}
      >
        <ToastTitle>{toastMessage.title}</ToastTitle>
        <ToastDescription>{toastMessage.description}</ToastDescription>
      </Toast>
      
      <div style={{ marginBottom: '10px', fontSize: '13px', fontWeight: 'bold' }}>
        Settings
      </div>
      <div style={{ marginBottom: '8px', fontSize: '11px', color: '#ccc' }}>
        Gemini API Key
      </div>
      <input
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
        type="text"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
        placeholder="Enter your Gemini API key"
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
          onClick={() => setView("queue")}
        >
          Back
        </button>
        <button
          style={{
            padding: '4px 8px',
            borderRadius: '3px',
            border: 'none',
            backgroundColor: apiKey.trim() ? '#007acc' : '#555',
            color: 'white',
            cursor: apiKey.trim() ? 'pointer' : 'not-allowed',
            fontSize: '10px',
            height: '24px',
            minWidth: '40px'
          }}
          onClick={handleSave}
          disabled={!apiKey.trim()}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default Settings 