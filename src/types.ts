export interface UploadedImage {
      file: File;
      name: string;
      size: number;
    }
    
    export interface ConvertedImage {
      file: File;
      preview: string;
      fileType: 'jpg' | 'png';
    }
    
    export interface OptimizedImage {
      file: File;
      preview: string;
      size: number;
    }
