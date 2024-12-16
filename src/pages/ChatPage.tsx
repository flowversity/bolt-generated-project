import React, { useState, useRef, useEffect, useCallback } from 'react';
    import { fetchWithGemini } from '../utils/api';
    import { useChat } from '../context/ChatContext';
    import { MoreVertical, X } from 'lucide-react';
    
    const ChatPage = () => {
      const [messages, setMessages] = useState<
        { role: 'user' | 'assistant'; content: string }[]
      >([]);
      const [input, setInput] = useState('');
      const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
      const chatContainerRef = useRef<HTMLDivElement>(null);
      const [debugInfo, setDebugInfo] = useState<any>(null);
      const { addChatToHistory, updateChatHistory, selectedChat, setSelectedChat } = useChat();
      const [currentChatId, setCurrentChatId] = useState<string | null>(null);
      const [isChatSettingsOpen, setIsChatSettingsOpen] = useState(false);
      const settingsRef = useRef<HTMLDivElement>(null);
    
      const handleOpenChatSettings = () => {
        setIsChatSettingsOpen(true);
      };
    
      const handleCloseChatSettings = () => {
        setIsChatSettingsOpen(false);
      };
    
      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
            handleCloseChatSettings();
          }
        };
    
        if (isChatSettingsOpen) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [isChatSettingsOpen]);
    
      useEffect(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, [messages]);
    
      useEffect(() => {
        if (selectedChat) {
          setMessages(selectedChat.messages);
          setCurrentChatId(selectedChat.id);
        } else {
          setMessages([]);
          setCurrentChatId(null);
        }
      }, [selectedChat, setSelectedChat]);
    
      const handleSendMessage = async () => {
        if (!input.trim()) return;
    
        const userMessage = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
    
        const chatHistory = messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        }));
    
        const prompt = {
          contents: [...chatHistory, { role: 'user', parts: [{ text: input }] }],
        };
    
        try {
          setDebugInfo({
            request: {
              model: selectedModel,
              prompt: JSON.stringify(prompt, null, 2),
            },
            response: null,
            error: null,
          });
    
          const response = await fetchWithGemini(
            `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent`,
            {
              method: 'POST',
              body: JSON.stringify(prompt),
            }
          );
    
          setDebugInfo(prev => ({ ...prev, response: JSON.stringify(response, null, 2) }));
    
          if (response && response.candidates && response.candidates.length > 0) {
            const assistantMessage = {
              role: 'assistant' as const,
              content: response.candidates[0].content.parts[0].text,
            };
            setMessages(prev => [...prev, assistantMessage]);
            if (selectedChat) {
              updateChatHistory(selectedChat.id, [...messages, userMessage, assistantMessage]);
            } else {
              const firstMessage = messages[0]?.content;
              if (firstMessage) {
                const title = firstMessage.substring(0, 20) + "...";
                addChatToHistory(title, [...messages, userMessage, assistantMessage], currentChatId);
              }
            }
          } else {
            const assistantMessage = {
              role: 'assistant' as const,
              content: 'Sorry, I could not generate a response.',
            };
            setMessages(prev => [...prev, assistantMessage]);
          }
        } catch (error: any) {
          console.error('Error fetching Gemini API:', error);
          setDebugInfo(prev => ({ ...prev, error: error.message }));
          const assistantMessage = {
            role: 'assistant' as const,
            content: `Sorry, there was an error: ${error.message}`,
          };
          setMessages(prev => [...prev, assistantMessage]);
        }
      };
    
      return (
        <div className="flex flex-col h-full relative">
          {isChatSettingsOpen && (
            <div ref={settingsRef} className="absolute top-0 right-0 h-full w-64 bg-gray-100 dark:bg-[#1C1C1C] p-4 flex flex-col transition-colors z-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat Settings</h2>
                <button onClick={handleCloseChatSettings} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="mb-4">
                <label htmlFor="modelSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  AI Model
                </label>
                <select
                  id="modelSelect"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="block w-full px-3 py-2 bg-gray-100 dark:bg-[#2C2C2C] border border-gray-200 dark:border-[#3C3C3C] rounded-md text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="gemini-pro">Gemini Pro</option>
                  <option value="gemini-ultra">Gemini Ultra</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                  <option value="gemini-1.5-flash-002">Gemini 1.5 Flash 002</option>
                </select>
              </div>
            </div>
          )}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-xl p-3 max-w-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-[#2C2C2C] text-gray-900 dark:text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
    
          <div className="p-4 border-t border-gray-200 dark:border-[#3C3C3C] flex items-center gap-2">
            <button onClick={handleOpenChatSettings} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
              <MoreVertical size={18} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 bg-gray-100 dark:bg-[#2C2C2C] border border-gray-200 dark:border-[#3C3C3C] rounded-md text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
            >
              Send
            </button>
          </div>
          {debugInfo && (
            <div className="p-4 bg-gray-100 dark:bg-[#2C2C2C] rounded-md mt-4 overflow-x-auto">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Debug Info</h3>
              <pre className="text-sm text-gray-700 dark:text-gray-300">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
      );
    };
    
    export default ChatPage;
