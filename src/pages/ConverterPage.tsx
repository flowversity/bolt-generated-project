import React, { useState } from 'react';
    import { ImageIcon, Rocket } from 'lucide-react';
    import ImageConverter from '../components/ImageConverter';
    
    const ConverterPage = () => {
      const [activeTab, setActiveTab] = useState('converter');
    
      const handleTabChange = (tab: string) => {
        setActiveTab(tab);
      };
    
      return (
        <div className="flex flex-col h-full w-full">
          <div className="flex-1">
            {activeTab === 'converter' && <ImageConverter />}
            {activeTab === 'optimizer' && (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Image Optimizer Coming Soon...
              </div>
            )}
          </div>
    
          <nav className="bg-gray-100 dark:bg-[#1C1C1C] border-t border-gray-200 dark:border-[#3C3C3C] p-4 flex justify-around transition-colors fixed bottom-0 left-0 right-0">
            <button
              onClick={() => handleTabChange('converter')}
              className={`flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ${
                activeTab === 'converter' ? 'text-gray-900 dark:text-white' : ''
              }`}
            >
              <ImageIcon size={24} />
              <span className="text-xs mt-1">Converter</span>
            </button>
            <button
              onClick={() => handleTabChange('optimizer')}
              className={`flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ${
                activeTab === 'optimizer' ? 'text-gray-900 dark:text-white' : ''
              }`}
            >
              <Rocket size={24} />
              <span className="text-xs mt-1">Optimizer</span>
            </button>
          </nav>
        </div>
      );
    };
    
    export default ConverterPage;
