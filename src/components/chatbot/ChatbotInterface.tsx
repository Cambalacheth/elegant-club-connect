
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getRandomBotResponse } from './chatbotResponses';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotInterfaceProps {
  currentLanguage: string;
}

const ChatbotInterface: React.FC<ChatbotInterfaceProps> = ({ currentLanguage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Initial bot greeting
  useEffect(() => {
    const welcomeMessage = {
      id: `bot-${Date.now()}`,
      text: currentLanguage === 'en' 
        ? 'Hello! I\'m Terreta Assistant. How can I help you with information about Terreta Hub, domains, or projects?' 
        : '¡Hola! Soy el Asistente de Terreta. ¿En qué puedo ayudarte con información sobre Terreta Hub, dominios o proyectos?',
      sender: 'bot' as const,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [currentLanguage]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check if should show scroll button
  useEffect(() => {
    const checkScrollPosition = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
      }
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot typing
    setIsTyping(true);

    // Simulate bot response with typing delay
    setTimeout(() => {
      const botResponse = getRandomBotResponse(inputValue, currentLanguage);
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Card className="shadow-lg border-club-beige-dark h-[600px] flex flex-col">
      <CardHeader className="p-3 border-b flex flex-row items-center justify-between bg-club-beige rounded-t-lg">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2 bg-club-terracotta">
            <AvatarFallback>TB</AvatarFallback>
            <AvatarImage src="/orange-favicon.svg" />
          </Avatar>
          <h3 className="font-medium text-club-brown">
            {currentLanguage === 'en' ? 'Terreta Assistant' : 'Asistente de Terreta'}
          </h3>
        </div>
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
          {currentLanguage === 'en' ? 'Beta' : 'Beta'}
        </Badge>
      </CardHeader>
      
      <CardContent 
        ref={messagesContainerRef}
        className="p-3 overflow-y-auto flex-1 relative"
      >
        <div className="flex flex-col space-y-3">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && (
                <Avatar className="h-8 w-8 mr-2 flex-shrink-0 mt-1 bg-club-terracotta">
                  <AvatarFallback>T</AvatarFallback>
                  <AvatarImage src="/orange-favicon.svg" />
                </Avatar>
              )}
              <div 
                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-club-terracotta text-white' 
                    : 'bg-club-beige text-club-brown'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8 ml-2 flex-shrink-0 mt-1">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <Avatar className="h-8 w-8 mr-2 flex-shrink-0 mt-1 bg-club-terracotta">
                <AvatarFallback>T</AvatarFallback>
                <AvatarImage src="/orange-favicon.svg" />
              </Avatar>
              <div className="bg-club-beige text-club-brown px-3 py-2 rounded-lg max-w-[80%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-club-brown rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-club-brown rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-2 bg-club-brown rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {showScrollButton && (
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-3 bottom-3 rounded-full shadow-md bg-white"
            onClick={scrollToBottom}
          >
            <ArrowDown size={16} />
          </Button>
        )}
      </CardContent>
      
      <CardFooter className="p-3 border-t">
        <div className="flex w-full gap-2">
          <Input
            placeholder={currentLanguage === 'en' ? 'Type a message...' : 'Escribe un mensaje...'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!inputValue.trim()}>
            <Send size={18} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatbotInterface;
