
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { generateChatResponse, tourGeniusContext } from '@/lib/gemini';

type Message = {
  role: 'user' | 'model';
  content: string;
};

type ChatContextType = {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Halo! Saya asisten TourGenius. Apa yang bisa saya bantu?' }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user' as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare messages for the API with context injected for the first message
      const contextualMessages = messages.length === 1 
        ? [
            { role: 'user', content: `${tourGeniusContext}\n\nRemember this context about TourGenius when answering questions.` },
            { role: 'model', content: 'Saya memahami konteks tentang TourGenius. Saya siap membantu Anda.' },
            userMessage
          ]
        : [...messages, userMessage];

      // Generate AI response
      const response = await generateChatResponse(contextualMessages);
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'model', content: 'Maaf, saya mengalami masalah teknis. Silakan coba lagi nanti.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { role: 'model', content: 'Halo! Saya asisten TourGenius. Apa yang bisa saya bantu?' }
    ]);
  };

  return (
    <ChatContext.Provider value={{ messages, isOpen, isLoading, openChat, closeChat, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};
