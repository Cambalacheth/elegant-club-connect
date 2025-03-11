
import React from 'react';

interface VideoEmbedProps {
  videoId: string;
  title: string;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ videoId, title }) => {
  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-md mb-8">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  );
};

export default VideoEmbed;
