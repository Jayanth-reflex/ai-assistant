// ResumeUpload.tsx
// Resume/document upload and parsing component
import React, { useState } from 'react';

// At the top of the file, add a check for window.electronAPI
const isElectronAPIAvailable = typeof window !== 'undefined' && !!window.electronAPI;

/**
 * ResumeUpload allows the user to upload a PDF or DOCX resume, parses key fields, and displays the extracted data.
 */
export const ResumeUpload: React.FC = () => {
  const [parsed, setParsed] = useState<{ name: string; skills: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      // Save file to temp path (renderer cannot access fs, so use preload or IPC to main)
      // @ts-ignore
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      // @ts-ignore
      const tempPath = await window.electronAPI.saveTempFile(file.name, buffer);
      // @ts-ignore
      const result = await window.electron.ipcRenderer.invoke('parse-resume', tempPath);
      setParsed(result);
    } catch (err: any) {
      setError(err.message || 'Failed to parse resume');
    }
    setLoading(false);
  };

  return (
    <div className="resume-upload-container bg-white rounded shadow p-2">
      <label className="block font-bold mb-1">Upload Resume (PDF or DOCX):</label>
      <input type="file" accept=".pdf,.docx" onChange={handleFileChange} disabled={loading} />
      {loading && <div className="text-gray-400">Parsing...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {parsed && (
        <div className="mt-2">
          <div><b>Name:</b> {parsed.name}</div>
          <div><b>Skills:</b> {parsed.skills.join(', ') || 'N/A'}</div>
        </div>
      )}
    </div>
  );
}; 