// Chat.tsx
// Chat UI component for displaying and sending messages
import React, { useState } from 'react';

/**
 * Chat displays the chat log, input box, and send button for user/AI interaction.
 * This is the main chat interface in the sidebar overlay.
 */
export const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Send prompt to Gemini via IPC and update chat log
  const sendPrompt = async () => {
    if (!input.trim()) return;
    setChatLog((log) => [...log, { role: 'user', content: input }]);
    setLoading(true);
    try {
      // @ts-ignore
      const response = await window.electron.ipcRenderer.invoke('gemini-prompt', input);
      setChatLog((log) => [...log, { role: 'assistant', content: response }]);
    } catch (err) {
      setChatLog((log) => [...log, { role: 'assistant', content: 'Error: ' + (err as any).message }]);
    }
    setInput('');
    setLoading(false);
  };

  return (
    <div className="chat-container flex flex-col gap-2 bg-white rounded shadow p-2 h-80 overflow-y-auto">
      <div className="flex-1 overflow-y-auto mb-2">
        {chatLog.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <span className={msg.role === 'user' ? 'font-bold text-blue-600' : 'font-bold text-green-700'}>
              {msg.role === 'user' ? 'You' : 'AI'}:
            </span>{' '}
            <span>{msg.content}</span>
          </div>
        ))}
        {loading && <div className="text-gray-400">AI is typing...</div>}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendPrompt()}
          placeholder="Type your question..."
          disabled={loading}
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
          onClick={sendPrompt}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}; 