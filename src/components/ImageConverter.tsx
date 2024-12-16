import React, { useState, useCallback } from 'react';
    import { useDropzone } from 'react-dropzone';
    import ImageCard from './ImageCard';
    import JSZip from 'jszip';
    import UploadedImageList from './UploadedImageList';
    import { UploadedImage, ConvertedImage } from '../types';
    
    interface ImageConverterProps {
      onConvertComplete?: (convertedImages: ConvertedImage[]) => void;
    }
    
    const ImageConverter: React.FC<ImageConverterProps> = ({ onConvertComplete }) => {
      const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
      const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
      const [selectedFileType, setSelectedFileType] = useState<'jpg' | 'png'>('jpg');
      const [isConverting, setIsConverting] = useState(false);
      const [isFadingOut, setIsFadingOut] = useState(false);
    
      const onDrop = useCallback((acceptedFiles: File[]) => {
        const newImages = acceptedFiles.map(file => ({
          file,
          name: file.name,
          size: file.size,
        }));
        setUploadedImages(prev => [...prev, ...newImages]);
      }, []);
    
      const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });
    
      const handleConvertImages = useCallback(async () => {
        setIsConverting(true);
        const converted = await Promise.all(uploadedImages.map(async (image) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          const fileReader = new FileReader();
          fileReader.readAsDataURL(image.file);
          await new Promise(resolve => fileReader.onload = resolve);
          img.src = fileReader.result as string;
          await new Promise(resolve => img.onload = resolve);
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL(`image/${selectedFileType}`);
          const blob = await fetch(dataURL).then(res => res.blob());
          const convertedFile = new File([blob], `${image.name.replace(/\.[^/.]+$/, "")}.${selectedFileType}`, { type: `image/${selectedFileType}` });
          return { file: convertedFile, preview: URL.createObjectURL(convertedFile), fileType: selectedFileType };
        }));
        setConvertedImages(converted);
        setIsConverting(false);
        setIsFadingOut(true);
        setTimeout(() => {
          setUploadedImages([]);
          setIsFadingOut(false);
        }, 400);
        if (onConvertComplete) {
          onConvertComplete(converted);
        }
      }, [uploadedImages, selectedFileType, onConvertComplete]);
    
      const handleDownloadAll = async () => {
        if (convertedImages.length === 0) return;
        const zip = new JSZip();
        for (const image of convertedImages) {
          zip.file(image.file.name, image.file);
        }
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'images.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    
      const handleRemoveImage = (name: string) => {
        setUploadedImages((prev) => prev.filter((image) => image.name !== name));
      };
    
      return (
        <div className="flex flex-col h-full w-full">
          <div className="flex w-full h-full">
            <div className="w-1/2 p-4">
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="fileTypeSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  File Type
                </label>
                <select
                  id="fileTypeSelect"
                  value={selectedFileType}
                  onChange={(e) => setSelectedFileType(e.target.value as 'jpg' | 'png')}
                  className="bg-gray-100 dark:bg-[#2C2C2C] border border-gray-200 dark:border-[#3C3C3C] rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="jpg">JPG</option>
                  <option value="png">PNG</option>
                </select>
              </div>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg p-6 flex items-center justify-center cursor-pointer transition-colors ${
                  isDragActive ? 'bg-gray-200 dark:bg-[#3C3C3C]' : 'bg-gray-100 dark:bg-[#2C2C2C]'
                }`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-gray-600 dark:text-gray-300">Drop the images here...</p>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">
                    Drag 'n' drop some images here, or click to select images
                  </p>
                )}
              </div>
              <button
                onClick={handleConvertImages}
                disabled={isConverting || uploadedImages.length === 0}
                className="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
              >
                {isConverting ? 'Converting...' : 'Convert Images'}
              </button>
              <UploadedImageList images={uploadedImages} onRemove={handleRemoveImage} isFadingOut={isFadingOut} />
            </div>
            <div className="w-1/2 p-4">
              <button
                onClick={handleDownloadAll}
                disabled={convertedImages.length === 0}
                className="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
              >
                Download All
              </button>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {convertedImages.map((image, index) => (
                  <ImageCard key={index} file={image.file} preview={image.preview} converted={image.preview} />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    export default ImageConverter;
