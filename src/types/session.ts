// session.ts
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface SessionData {
  id: string;
  createdAt: number;
  chatLog: ChatMessage[];
  screenshots: string[];
  audioFiles: string[];
  transcripts: string[];
  followUps: string[];
  resume?: {
    name: string;
    skills: string[];
  };
} 