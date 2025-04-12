
import React from "react";
import { FileText, Video, BookOpen, Package } from "lucide-react";
import { ContentType } from "@/types/content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContentHeaderProps {
  selectedType: ContentType;
  onTypeChange: (type: ContentType) => void;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({
  selectedType,
  onTypeChange,
}) => {
  const handleTypeChange = (value: string) => {
    onTypeChange(value as ContentType);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-serif text-club-brown">Recursos</h1>
      </div>

      <Tabs 
        value={selectedType} 
        onValueChange={handleTypeChange}
        className="w-full"
      >
        <TabsList className="bg-club-beige/50 p-1 w-full md:w-auto grid grid-cols-2 md:flex">
          <TabsTrigger value="article" className="flex items-center gap-2 data-[state=active]:bg-club-orange data-[state=active]:text-white">
            <FileText size={16} />
            Artículos
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2 data-[state=active]:bg-club-orange data-[state=active]:text-white">
            <Video size={16} />
            Videos
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2 data-[state=active]:bg-club-orange data-[state=active]:text-white">
            <BookOpen size={16} />
            Guías
          </TabsTrigger>
          <TabsTrigger value="resource" className="flex items-center gap-2 data-[state=active]:bg-club-orange data-[state=active]:text-white">
            <Package size={16} />
            Recursos
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ContentHeader;
