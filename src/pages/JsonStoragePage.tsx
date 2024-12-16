import React, { useState } from 'react';
    
    const JsonStoragePage = () => {
      const [jsonData, setJsonData] = useState<any>(null);
    
      const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        try {
          const pastedText = event.clipboardData.getData('text/plain');
          const parsedJson = JSON.parse(pastedText);
          setJsonData(parsedJson);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          setJsonData(null);
        }
      };
    
      return (
        <div className="p-4">
          <textarea
            onPaste={handlePaste}
            className="w-full h-96 p-2 bg-gray-100 dark:bg-[#2C2C2C] border border-gray-200 dark:border-[#3C3C3C] rounded-md text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="Paste your Webflow JSON here..."
          />
          {jsonData && (
            <pre className="mt-4 text-sm text-gray-700 dark:text-gray-300">
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          )}
        </div>
      );
    };
    
    export default JsonStoragePage;
