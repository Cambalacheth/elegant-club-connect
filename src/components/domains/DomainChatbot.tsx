
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface DomainChatbotProps {
  currentLanguage: string;
}

const DomainChatbot: React.FC<DomainChatbotProps> = ({ currentLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial bot greeting
  useEffect(() => {
    const welcomeMessage = {
      id: `bot-${Date.now()}`,
      text: currentLanguage === 'en' 
        ? 'Hello! I\'m Terreta Assistant. How can I help you with domains today?' 
        : '¡Hola! Soy el Asistente de Terreta. ¿Cómo puedo ayudarte con los dominios hoy?',
      sender: 'bot' as const,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [currentLanguage]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        currentLanguage === 'en' 
          ? 'I can help you find the perfect domain for your project!' 
          : '¡Puedo ayudarte a encontrar el dominio perfecto para tu proyecto!',
        currentLanguage === 'en' 
          ? 'Terreta Hub offers various domains in different categories.' 
          : 'Terreta Hub ofrece varios dominios en diferentes categorías.',
        currentLanguage === 'en' 
          ? 'Would you like to know more about available domains?' 
          : '¿Te gustaría saber más sobre los dominios disponibles?',
        currentLanguage === 'en' 
          ? 'Available domains can be claimed for your projects.' 
          : 'Los dominios disponibles pueden ser reclamados para tus proyectos.',
        currentLanguage === 'en' 
          ? 'This is just a demo of the chatbot functionality.' 
          : 'Esta es solo una demostración de la funcionalidad del chatbot.'
      ];

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg flex items-center justify-center z-50"
      >
        <Bot size={24} />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 z-50 shadow-xl transition-all duration-300 ease-in-out ${
      isMinimized ? 'w-72 h-14' : 'w-80 sm:w-96 h-[500px]'
    }`}>
      <CardHeader className="p-3 border-b flex flex-row items-center justify-between bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center">
          <Bot size={20} className="mr-2" />
          <h3 className="font-medium text-sm">
            {currentLanguage === 'en' ? 'Terreta Assistant' : 'Asistente de Terreta'}
          </h3>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={toggleMinimize} className="h-8 w-8 text-primary-foreground hover:bg-primary/80">
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8 text-primary-foreground hover:bg-primary/80">
            <X size={16} />
          </Button>
        </div>
      </CardHeader>
      
      {!isMinimized && (
        <>
          <CardContent className="p-3 overflow-y-auto h-[385px]">
            <div className="flex flex-col space-y-3">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] px-3 py-2 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
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
        </>
      )}
    </Card>
  );
};

export default DomainChatbot;
