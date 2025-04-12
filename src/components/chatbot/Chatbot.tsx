
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { MessageCircle, Send, X, Loader2, MoveUpRight } from 'lucide-react';
import { sendChatMessage, ChatMessage } from '@/utils/gemini';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatbotProps {
  position?: 'bottom-right' | 'bottom-left';
}

const Chatbot: React.FC<ChatbotProps> = ({ position = 'bottom-right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Halo! Saya asisten virtual TourGenius. Bagaimana saya bisa membantu Anda hari ini?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = { role: 'user' as const, content: inputValue };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const allMessages = [...messages, userMessage];
      const response = await sendChatMessage(allMessages);
      
      setMessages([
        ...allMessages,
        { role: 'assistant', content: response }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([
        ...messages,
        userMessage,
        { role: 'assistant', content: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const positionClasses = position === 'bottom-right'
    ? 'bottom-4 right-4'
    : 'bottom-4 left-4';

  // Calculate dynamic width based on screen size
  const chatWidth = isMobile ? 'w-[calc(100vw-32px)]' : 'w-[350px]';
  const chatHeight = isMobile ? 'h-[420px]' : 'h-[350px]';

  return (
    <div className={`fixed ${positionClasses} z-50 transition-all duration-300 ease-in-out`}>
      {isOpen ? (
        <Card className={`${chatWidth} shadow-xl border border-purple-200 animate-in slide-in-from-bottom-5 duration-300 bg-white`}>
          <CardHeader className="bg-gradient-to-r from-blue-900 to-purple-800 text-white py-3 px-4 flex flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-blue-700">
                <MessageCircle size={16} />
              </Avatar>
              <span className="font-medium">TourGenius Asisten</span>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-800" onClick={toggleChat}>
              <X size={18} />
            </Button>
          </CardHeader>
          
          <ScrollArea className={`${chatHeight} p-4 bg-gray-50`}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-2 rounded-lg text-sm
                      ${message.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-tr-none shadow-md' 
                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm'
                      }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <CardFooter className="p-2 border-t bg-white">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                ref={inputRef}
                placeholder="Ketik pesan Anda di sini..."
                value={inputValue}
                onChange={handleInputChange}
                disabled={isLoading}
                className="flex-1 border-gray-300 focus:border-purple-400 focus:ring-purple-300"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button 
          onClick={toggleChat} 
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all p-0 flex items-center justify-center group"
        >
          <MessageCircle size={24} className="text-white group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
        </Button>
      )}
    </div>
  );
};

export default Chatbot;
