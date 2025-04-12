import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { sendChatMessage, ChatMessage } from '@/utils/gemini';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface ChatbotProps {
  position?: 'bottom-right' | 'bottom-left';
}

const Chatbot: React.FC<ChatbotProps> = ({ position = 'bottom-right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Halo! Saya asisten virtual TourGenius. Bagaimana saya bisa membantu Anda hari ini?',
    },
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

      setMessages([...allMessages, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([
        ...messages,
        userMessage,
        { role: 'assistant', content: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const positionClasses = position === 'bottom-right' ? 'bottom-4 right-4' : 'bottom-4 left-4';

  if (isMobile) {
    return (
      <div className={`fixed ${positionClasses} z-50`}>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 p-0 flex items-center justify-center group relative overflow-hidden"
              aria-label="Open chatbot"
            >
              <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="p-0 h-[50vh] sm:h-[60vh] md:h-[70vh] rounded-t-2xl flex flex-col overflow-hidden bg-gray-50 border-t border-blue-200 shadow-lg"
          >
            <SheetHeader className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-3 px-4 sm:px-6 flex flex-row justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 bg-blue-600 transform hover:scale-105 transition-transform duration-200">
                  <AvatarFallback>
                    <MessageCircle className="h-5 w-5 text-white" />
                  </AvatarFallback>
                </Avatar>
                <SheetTitle className="text-base sm:text-lg font-semibold">TourGenius Asisten</SheetTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="text-white hover:bg-blue-800 rounded-full"
                aria-label="Close chatbot"
              >
                <X className="h-5 w-5" />
              </Button>
            </SheetHeader>

            <ScrollArea className="flex-1 p-3 sm:p-4 bg-gray-50">
              <div className="space-y-3 sm:space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
                  >
                    <div
                      className={`relative max-w-[75%] sm:max-w-[80%] px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-sm sm:text-base leading-relaxed
                        ${message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-tr-none shadow-md'
                          : 'bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm'
                        }`}
                    >
                      {message.content}
                      <div
                        className={`absolute top-0 w-3 h-3 border-gray-200
                          ${message.role === 'user'
                            ? 'right-0 -mr-2 rotate-45 bg-blue-600 border-r border-t'
                            : 'left-0 -ml-2 -rotate-45 bg-white border-l border-b'
                          }`}
                      />
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-2 sm:p-3 border-t bg-white">
              <form onSubmit={handleSubmit} className="flex w-full gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Ketik pesan Anda di sini..."
                  value={inputValue}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-400 rounded-lg text-sm sm:text-base py-2 sm:py-2.5"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 w-10 sm:h-11 sm:w-11 shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className={`fixed ${positionClasses} z-50 transition-all duration-300 ease-in-out`}>
      {isOpen ? (
        <Card className="w-[320px] sm:w-[360px] lg:w-[400px] shadow-xl border border-blue-200 animate-in slide-in-from-bottom-10 duration-300 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-3 px-4 sm:px-5 flex flex-row justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 bg-blue-600 transform hover:scale-105 transition-transform duration-200">
                <AvatarFallback>
                  <MessageCircle className="h-5 w-5 text-white" />
                </AvatarFallback>
              </Avatar>
              <span className="text-base sm:text-lg font-semibold">TourGenius Asisten</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-800 rounded-full"
              onClick={toggleChat}
              aria-label="Close chatbot"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[320px] sm:h-[360px] p-3 sm:p-4 bg-gray-50">
              <div className="space-y-3 sm:space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
                  >
                    <div
                      className={`relative max-w-[75%] sm:max-w-[80%] px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-sm sm:text-base leading-relaxed
                        ${message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-tr-none shadow-md'
                          : 'bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm'
                        }`}
                    >
                      {message.content}
                      <div
                        className={`absolute top-0 w-3 h-3 border-gray-200
                          ${message.role === 'user'
                            ? 'right-0 -mr-2 rotate-45 bg-blue-600 border-r border-t'
                            : 'left-0 -ml-2 -rotate-45 bg-white border-l border-b'
                          }`}
                      />
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-2 sm:p-3 border-t bg-white">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                ref={inputRef}
                placeholder="Ketik pesan Anda di sini..."
                value={inputValue}
                onChange={handleInputChange}
                disabled={isLoading}
                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-400 rounded-lg text-sm sm:text-base py-2 sm:py-2.5"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 w-10 sm:h-11 sm:w-11 shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button
          onClick={toggleChat}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 p-0 flex items-center justify-center group relative overflow-hidden"
          aria-label="Open chatbot"
        >
          <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></span>
        </Button>
      )}
    </div>
  );
};

export default Chatbot;