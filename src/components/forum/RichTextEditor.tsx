
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Underline, Link, Code, ListOrdered, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  maxLength?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Escribe aquí...",
  rows = 5,
  disabled = false,
  maxLength,
}) => {
  const [selectionStart, setSelectionStart] = useState<number>(0);
  const [selectionEnd, setSelectionEnd] = useState<number>(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Track selection position in textarea
  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelectionStart(target.selectionStart || 0);
    setSelectionEnd(target.selectionEnd || 0);
  };

  // Apply formatting to selected text
  const applyFormatting = (prefix: string, suffix: string = prefix) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const startPos = selectionStart;
    const endPos = selectionEnd;
    const selectedText = value.substring(startPos, endPos);
    
    const beforeText = value.substring(0, startPos);
    const afterText = value.substring(endPos);
    
    // If text is selected, wrap it with formatting
    if (selectedText) {
      const newText = `${beforeText}${prefix}${selectedText}${suffix}${afterText}`;
      onChange(newText);
      
      // Set selection to after the formatted text
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          startPos + prefix.length, 
          endPos + prefix.length
        );
      }, 0);
    } else {
      // If no text is selected, insert empty tags and place cursor between them
      const newText = `${beforeText}${prefix}${suffix}${afterText}`;
      onChange(newText);
      
      // Place cursor between tags
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          startPos + prefix.length, 
          startPos + prefix.length
        );
      }, 0);
    }
  };

  // Insert link
  const insertLink = () => {
    const selectedText = value.substring(selectionStart, selectionEnd);
    const url = prompt("Introduce la URL del enlace:", selectedText.startsWith("http") ? selectedText : "https://");
    
    if (url) {
      const linkText = selectionStart !== selectionEnd ? selectedText : "enlace";
      const linkMarkup = `[${linkText}](${url})`;
      
      const beforeText = value.substring(0, selectionStart);
      const afterText = value.substring(selectionEnd);
      
      onChange(`${beforeText}${linkMarkup}${afterText}`);
    }
  };

  // Insert Terreta domain reference
  const insertTerretaDomain = () => {
    const domains = [
      "legal", "audiovisual", "tech", "eventos", 
      "salud", "finanzas", "marketing", "turismo"
    ];
    
    const domain = prompt(`Introduce el dominio de Terreta (ejemplos: ${domains.join(", ")}):`, "");
    
    if (domain) {
      const domainRef = `#${domain.toLowerCase().trim()}`;
      
      const beforeText = value.substring(0, selectionStart);
      const afterText = value.substring(selectionEnd);
      
      onChange(`${beforeText}${domainRef}${afterText}`);
    }
  };

  // Format buttons configuration
  const formatButtons = [
    { 
      label: "Negrita", 
      icon: <Bold size={16} />, 
      action: () => applyFormatting("**") 
    },
    { 
      label: "Itálica", 
      icon: <Italic size={16} />, 
      action: () => applyFormatting("*") 
    },
    { 
      label: "Subrayado", 
      icon: <Underline size={16} />, 
      action: () => applyFormatting("__") 
    },
    { 
      label: "Enlace", 
      icon: <Link size={16} />, 
      action: insertLink 
    },
    { 
      label: "Código", 
      icon: <Code size={16} />, 
      action: () => applyFormatting("`") 
    },
    { 
      label: "Lista numerada", 
      icon: <ListOrdered size={16} />, 
      action: () => applyFormatting("\n1. ", "") 
    },
    { 
      label: "Dominio Terreta", 
      icon: <ListChecks size={16} />, 
      action: insertTerretaDomain 
    }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center bg-white border rounded-t border-input px-2 py-1 space-x-1">
        {formatButtons.map((button, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            type="button"
            className="h-8 w-8 p-0"
            title={button.label}
            onClick={button.action}
            disabled={disabled}
          >
            {button.icon}
          </Button>
        ))}
      </div>
      
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelect}
        onFocus={handleSelect}
        onClick={handleSelect}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        className={cn(
          "resize-none rounded-t-none font-mono",
          disabled && "bg-muted"
        )}
      />
      
      {maxLength && (
        <div className="flex justify-end">
          <span className="text-xs text-gray-500">
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
