
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

// Imagen de pájaros de Terreta
const birds = [
  '/lovable-uploads/38415027-1a0b-4427-a514-ed9f57475d6b.png', // Gorrion 1
  '/lovable-uploads/5996e8d4-20aa-4b4c-8776-8c3c3e60e75a.png', // Gorrion 2
  '/lovable-uploads/89461e1d-3378-4375-86b6-c6d7130d20bf.png', // Gorrion 3
  '/lovable-uploads/9c3ab4d8-6b49-416f-af3d-5fd353772b66.png', // Gorrion 4
];

const BirdImage = () => {
  const [currentBirdIndex, setCurrentBirdIndex] = useState(0);
  
  // Cambiar la imagen cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBirdIndex((prevIndex) => (prevIndex + 1) % birds.length);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card className="overflow-hidden rounded-xl shadow-lg border-none bg-transparent flex items-center justify-center h-[600px]">
      <div className="relative w-full h-full">
        <img 
          src={birds[currentBirdIndex]} 
          alt="Terreta Bird" 
          className="w-full h-full object-contain p-4 transition-opacity duration-500" 
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {birds.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentBirdIndex ? 'bg-club-terracotta' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentBirdIndex(index)}
              aria-label={`Bird image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default BirdImage;
