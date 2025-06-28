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
    <div className="p-6 max-w-md mx-auto">
      <Toast
        open={toastOpen}
        onOpenChange={setToastOpen}
        variant={toastMessage.variant}
        duration={3000}
      >
        <ToastTitle>{toastMessage.title}</ToastTitle>
        <ToastDescription>{toastMessage.description}</ToastDescription>
      </Toast>
      
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <label className="block mb-2 font-medium">Gemini API Key</label>
      <input
        className="w-full border rounded px-3 py-2 mb-4"
        type="text"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
        placeholder="Enter your Gemini API key"
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSave}
      >
        Save
      </button>
      {status === "success" && <div className="text-green-600 mt-2">API key saved!</div>}
      {status === "error" && <div className="text-red-600 mt-2">Failed to save API key.</div>}
    </div>
  )
}

export default Settings 