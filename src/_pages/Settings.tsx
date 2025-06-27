import React, { useEffect, useState } from "react"

interface SettingsProps {
  setView: React.Dispatch<React.SetStateAction<'queue' | 'solutions' | 'debug' | 'settings'>>
}

const Settings: React.FC<SettingsProps> = ({ setView }) => {
  const [apiKey, setApiKey] = useState("")
  const [status, setStatus] = useState<null | "success" | "error">(null)

  useEffect(() => {
    // Load the API key from main process on mount
    window.electronAPI?.getGeminiApiKey?.().then((key: string) => {
      if (key) setApiKey(key)
    })
  }, [])

  const handleSave = async () => {
    try {
      await window.electronAPI?.setGeminiApiKey?.(apiKey)
      setStatus("success")
      setTimeout(() => {
        setStatus(null)
        setView("queue")
      }, 1200)
    } catch (e) {
      setStatus("error")
      setTimeout(() => setStatus(null), 2000)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
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