
import React from 'react';

interface ProjectImageProps {
  imageUrl?: string | null;
  name: string;
}

const ProjectImage = ({ imageUrl, name }: ProjectImageProps) => {
  return (
    <div className="h-40 bg-gray-200 relative">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-club-beige/50 flex items-center justify-center">
          <span className="text-club-brown/30 text-xl font-serif">
            {name.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProjectImage;
