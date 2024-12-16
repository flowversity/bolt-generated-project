import React, { useState, useCallback, useRef } from 'react';
    
    interface JsonStorageProps {
      onJsonStored?: (json: any) => void;
    }
    
    const JsonStorage: React.FC<JsonStorageProps> = ({ onJsonStored }) => {
      const [jsonData, setJsonData] = useState<any>(null);
      const preRef = useRef<HTMLPreElement>(null);
    
      const handlePaste = useCallback((event: React.ClipboardEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        try {
          const pastedText = event.clipboardData.getData('text/html');
          const jsonMatch = pastedText.match(/data-wf-json='({.*?})'/);
          if (jsonMatch && jsonMatch[1]) {
            const parsedJson = JSON.parse(jsonMatch[1]);
            setJsonData(parsedJson);
            if (onJsonStored) {
              onJsonStored(parsedJson);
            }
          } else {
            setJsonData(null);
            console.error('No Webflow JSON found in pasted HTML.');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
          setJsonData(null);
        }
      }, [onJsonStored]);
    
      return (
        <div className="w-full">
          <textarea
            onPaste={handlePaste}
            className="w-full h-96 p-2 bg-gray-100 dark:bg-[#2C2C2C] border border-gray-200 dark:border-[#3C3C3C] rounded-md text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="Paste your Webflow component here..."
          />
          {jsonData && (
            <div className="mt-4">
              <pre ref={preRef} className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {JSON.stringify(jsonData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      );
    };
    
    export default JsonStorage;
