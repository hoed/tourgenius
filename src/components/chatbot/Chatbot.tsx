
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { sendChatMessage, ChatMessage } from '@/utils/gemini';

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

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      {isOpen ? (
        <Card className="w-[350px] shadow-xl border border-gray-200 animate-in slide-in-from-bottom-5 duration-300">
          <CardHeader className="bg-blue-950 text-white py-3 px-4 flex flex-row justify-between items-center">
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
          
          <ScrollArea className="h-[350px] p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-2 rounded-lg text-sm
                      ${message.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                      }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <CardFooter className="p-2 border-t">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                ref={inputRef}
                placeholder="Ketik pesan Anda di sini..."
                value={inputValue}
                onChange={handleInputChange}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !inputValue.trim()}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button 
          onClick={toggleChat} 
          className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-all"
        >
          <MessageCircle size={24} />
        </Button>
      )}
    </div>
  );
};

export default Chatbot;
