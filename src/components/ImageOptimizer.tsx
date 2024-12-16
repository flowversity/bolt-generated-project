import React from 'react';
    import ImageCard from './ImageCard';
    import { OptimizedImage } from '../types';
    
    interface ImageOptimizerProps {
      optimizedImages: OptimizedImage[];
    }
    
    const ImageOptimizer: React.FC<ImageOptimizerProps> = ({ optimizedImages }) => {
      return (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {optimizedImages.map((image, index) => (
            <ImageCard key={index} file={image.file} preview={image.preview} converted={image.preview} />
          ))}
        </div>
      );
    };
    
    export default ImageOptimizer;
