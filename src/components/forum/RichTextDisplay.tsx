
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ content, className }) => {
  // Process Markdown-like content
  const processContent = (text: string) => {
    if (!text) return '';
    
    let processed = text;
    
    // Convert line breaks to <br>
    processed = processed.replace(/\n/g, '<br />');
    
    // Process bold text
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Process italic text
    processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Process underlined text
    processed = processed.replace(/__(.*?)__/g, '<u>$1</u>');
    
    // Process code
    processed = processed.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // Process links [text](url)
    processed = processed.replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, 
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-club-orange hover:underline">$1</a>');
    
    // Process numbered lists
    processed = processed.replace(/^\d+\.\s(.*?)$/gm, '<li>$1</li>');
    
    // Process Terreta domain references (#domain)
    processed = processed.replace(/#([a-zA-Z0-9_-]+)/g, 
      '<a href="/dominios/$1" class="text-club-terracotta font-medium hover:underline">#$1</a>');
    
    return processed;
  };

  return (
    <div 
      className={cn("prose max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: processContent(content) }}
    />
  );
};

export default RichTextDisplay;
