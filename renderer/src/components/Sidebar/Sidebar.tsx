// Sidebar.tsx
// Sidebar overlay component for the AI Interview Assistant
import React from 'react';
import { Chat } from '../Chat/Chat';
import { History } from '../History/History';
import { ResumeUpload } from '../ResumeUpload/ResumeUpload';
import { FollowUpButton } from '../FollowUpButton/FollowUpButton';

/**
 * Sidebar displays the main overlay UI, including chat, history, resume upload, and follow-up button.
 * This component is always-on-top and acts as the main entry point for user interaction.
 */
export const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar-overlay flex flex-col gap-4 p-4 bg-white/90 w-[400px] h-full shadow-lg">
      <Chat />
      <ResumeUpload />
      <FollowUpButton />
      <History />
    </aside>
  );
}; 