
interface PDFViewerProps {
  url: string;
}

export const PDFViewer = ({ url }: PDFViewerProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <iframe 
        src={url} 
        width="100%" 
        height="500px" 
        className="border-0 rounded-lg shadow-md"
        title="Documento PDF"
      />
      <div className="flex justify-center">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-blue-600 hover:underline"
        >
          Abrir PDF en una nueva pestaña
        </a>
      </div>
    </div>
  );
};
