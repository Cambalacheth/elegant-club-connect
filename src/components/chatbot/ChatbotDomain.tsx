
import { useState, useEffect } from 'react';
import ChatbotInterface from './ChatbotInterface';
import BirdImage from './BirdImage';

interface ChatbotDomainProps {
  currentLanguage: string;
}

const ChatbotDomain: React.FC<ChatbotDomainProps> = ({ currentLanguage }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-club-brown mb-8 text-center">
        {currentLanguage === 'en' ? 'Terreta Assistant' : 'Asistente de Terreta'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <BirdImage />
        <ChatbotInterface currentLanguage={currentLanguage} />
      </div>
    </div>
  );
};

export default ChatbotDomain;
