import React, { useState, useEffect } from 'react';
    import { UploadedImage } from '../types';
    
    interface UploadedImageListProps {
      images: UploadedImage[];
      onRemove: (id: string) => void;
      isFadingOut: boolean;
    }
    
    const UploadedImageList: React.FC<UploadedImageListProps> = ({ images, onRemove, isFadingOut }) => {
      const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
    
      useEffect(() => {
        if (images.length === 0 && isFadingOut) {
          const timeoutId = setTimeout(() => {
            // setIsFadingOut(false); // No need to reset isFadingOut here
          }, 400);
          return () => clearTimeout(timeoutId);
        }
      }, [images, isFadingOut]);
    
      const handleRemoveImage = (id: string) => {
        setRemovedImageIds((prev) => [...prev, id]);
        const timeoutId = setTimeout(() => {
          onRemove(id);
        }, 400);
        return () => clearTimeout(timeoutId);
      };
    
      return (
        <div className={`mt-4 transition-opacity duration-400 ${isFadingOut ? 'opacity-0' : 'opacity-1'}`}>
          {images.map((image, index) => (
            <div
              key={index}
              className={`flex items-center justify-between mb-2 transition-opacity duration-400 ${removedImageIds.includes(image.name) ? 'opacity-0' : 'opacity-1'}`}
            >
              <span className="text-gray-700 dark:text-gray-300">{image.name}</span>
              <span className="text-gray-500 dark:text-gray-400">{image.size} bytes</span>
              <button onClick={() => handleRemoveImage(image.name)} className="text-red-500 hover:text-red-700 transition-colors">
                Remove
              </button>
            </div>
          ))}
        </div>
      );
    };
    
    export default UploadedImageList;
