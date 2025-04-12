
interface ImageViewerProps {
  url: string;
}

export const ImageViewer = ({ url }: ImageViewerProps) => {
  return (
    <div className="overflow-hidden rounded-lg">
      <img 
        src={url} 
        alt="Recurso"
        className="w-full max-h-[600px] object-contain bg-gray-100"
      />
    </div>
  );
};
