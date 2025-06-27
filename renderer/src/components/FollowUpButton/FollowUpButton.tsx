// FollowUpButton.tsx
// Button to trigger follow-up summary/email generation
import React, { useState } from 'react';

/**
 * FollowUpButton triggers the generation of a follow-up summary or email using session data and Gemini.
 */
export const FollowUpButton: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      // @ts-ignore
      const sessionPath = await window.electronAPI.getCurrentSessionPath();
      // @ts-ignore
      const summary = await window.electron.ipcRenderer.invoke('generate-followup', sessionPath);
      setResult(summary);
    } catch (err: any) {
      setError(err.message || 'Failed to generate follow-up');
    }
    setLoading(false);
  };

  return (
    <div className="followup-btn-container bg-white rounded shadow p-2">
      <button
        className="followup-btn bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Follow-Up'}
      </button>
      {error && <div className="text-red-600 mt-1">{error}</div>}
      {result && (
        <div className="mt-2 bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}; 