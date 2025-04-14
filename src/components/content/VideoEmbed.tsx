
import React from 'react';

interface VideoEmbedProps {
  videoId: string;
  title: string;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ videoId, title }) => {
  return (
    <div className="relative pb-[56.25%] h-0 mb-8">
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoEmbed;
