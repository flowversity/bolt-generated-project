import React, { useState, useRef, useEffect } from 'react';
    import { X } from 'lucide-react';

    interface SettingsModalProps {
      isOpen: boolean;
      onClose: () => void;
    }

    const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
      const modalRef = useRef<HTMLDivElement>(null);
      const [apiKey, setApiKey] = useState('');

      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
          }
        };

        if (isOpen) {
          document.addEventListener('mousedown', handleClickOutside);
          const storedApiKey = localStorage.getItem('geminiApiKey');
          if (storedApiKey) {
            setApiKey(storedApiKey);
          }
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [isOpen, onClose]);

      const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(e.target.value);
      };

      const handleSaveApiKey = () => {
        localStorage.setItem('geminiApiKey', apiKey);
        onClose();
      };

      if (!isOpen) return null;

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div ref={modalRef} className="bg-white dark:bg-[#1C1C1C] rounded-xl shadow-lg p-6 w-full max-w-md relative transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="geminiApiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Google Gemini API Key
              </label>
              <input
                type="text"
                id="geminiApiKey"
                className="block w-full px-3 py-2 bg-gray-100 dark:bg-[#2C2C2C] border border-gray-200 dark:border-[#3C3C3C] rounded-md text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={handleApiKeyChange}
              />
            </div>
            <button
              onClick={handleSaveApiKey}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
            >
              Save API Key
            </button>
          </div>
        </div>
      );
    };

    export default SettingsModal;
