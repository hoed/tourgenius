
import React from 'react';
import { ChatBubble } from './ChatBubble';
import { ChatWindow } from './ChatWindow';
import { ChatProvider } from '@/contexts/ChatContext';

export const Chatbot = () => {
  return (
    <ChatProvider>
      <ChatBubble />
      <ChatWindow />
    </ChatProvider>
  );
};
