
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/contexts/ChatContext';

export const ChatBubble = () => {
  const { openChat } = useChat();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={openChat}
        className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};
