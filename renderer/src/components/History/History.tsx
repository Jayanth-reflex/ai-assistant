// History.tsx
// Session history browser component
import React, { useEffect, useState } from 'react';

/**
 * History displays a list of previous sessions and allows the user to browse past chat logs, screenshots, and transcripts.
 */
export const History: React.FC = () => {
  const [sessions, setSessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError(null);
      try {
        // @ts-ignore
        const result = await window.electronAPI.listSessions();
        setSessions(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load sessions');
      }
      setLoading(false);
    };
    fetchSessions();
  }, []);

  return (
    <div className="history-container bg-white rounded shadow p-2">
      <div className="font-bold mb-1">Session History</div>
      {loading && <div className="text-gray-400">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <ul className="list-disc pl-5">
        {sessions.map((session, i) => (
          <li key={i} className="cursor-pointer hover:underline">
            {session}
          </li>
        ))}
      </ul>
    </div>
  );
}; 