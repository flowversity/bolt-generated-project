import React from 'react';
    
    interface ImageCardProps {
      file: File;
      preview: string;
      converted: string | null;
    }
    
    const ImageCard: React.FC<ImageCardProps> = ({ file, preview, converted }) => {
      const handleDownload = () => {
        const link = document.createElement('a');
        link.href = converted || preview;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    
      return (
        <div onClick={handleDownload} className="flex flex-col items-center rounded-lg overflow-hidden hover:border-blue-500 border-2 border-transparent transition-colors bg-gray-100 dark:bg-[#1C1C1C] cursor-pointer">
          <img src={preview} alt={file.name} className="w-full h-40 object-cover" />
          <div className="p-2 flex items-center justify-between w-full">
            <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{file.name}</span>
          </div>
        </div>
      );
    };
    
    export default ImageCard;
