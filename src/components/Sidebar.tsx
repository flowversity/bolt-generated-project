import React, { useState, useEffect } from 'react';
    import { Home, MessageSquare, Library, Command, Clock, Settings, Layout, Edit, Database } from 'lucide-react';
    import ThemeToggle from './ThemeToggle';
    import SettingsModal from './SettingsModal';
    import { NavLink, useLocation } from 'react-router-dom';
    import { useChat } from '../context/ChatContext';
    
    const Sidebar = () => {
      const [isSettingsOpen, setIsSettingsOpen] = useState(false);
      const { chatHistory, setSelectedChat } = useChat();
      const location = useLocation();
      const isChatPage = location.pathname === '/chat';
    
      const handleOpenSettings = () => {
        setIsSettingsOpen(true);
      };
    
      const handleCloseSettings = () => {
        setIsSettingsOpen(false);
      };
    
      return (
        <div className="w-64 bg-gray-100 dark:bg-[#1C1C1C] h-screen p-4 flex flex-col transition-colors">
          <SettingsModal isOpen={isSettingsOpen} onClose={handleCloseSettings} />
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black dark:bg-white rounded-sm flex items-center justify-center">
                <span className="text-white dark:text-black font-bold text-sm">P</span>
              </div>
              <span className="text-gray-900 dark:text-white font-semibold">perplexity</span>
            </div>
            <ThemeToggle />
          </div>
    
          <button className="flex items-center gap-2 bg-gray-200 dark:bg-[#2C2C2C] text-gray-900 dark:text-white px-3 py-2 rounded-lg mb-6 transition-colors">
            <span>New Chat</span>
            <div className="flex items-center gap-1 ml-auto">
              <kbd className="px-1.5 py-0.5 text-xs bg-gray-300 dark:bg-[#3C3C3C] rounded">⌘</kbd>
              <kbd className="px-1.5 py-0.5 text-xs bg-gray-300 dark:bg-[#3C3C3C] rounded">N</kbd>
            </div>
          </button>
    
          <nav className="space-y-1">
            <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2C2C2C] transition-colors ${isActive ? 'bg-gray-200 dark:bg-[#2C2C2C]' : ''}`}>
              <Home size={18} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/chat" className={({ isActive }) => `flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2C2C2C] transition-colors ${isActive ? 'bg-gray-200 dark:bg-[#2C2C2C]' : ''}`}>
              <MessageSquare size={18} />
              <span>Chat</span>
            </NavLink>
            <NavLink to="/converter" className={({ isActive }) => `flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2C2C2C] transition-colors ${isActive ? 'bg-gray-200 dark:bg-[#2C2C2C]' : ''}`}>
              <Layout size={18} />
              <span>Converter</span>
            </NavLink>
            <NavLink to="/editor" className={({ isActive }) => `flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2C2C2C] transition-colors ${isActive ? 'bg-gray-200 dark:bg-[#2C2C2C]' : ''}`}>
              <Edit size={18} />
              <span>Editor</span>
            </NavLink>
            <NavLink to="/json-storage" className={({ isActive }) => `flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2C2C2C] transition-colors ${isActive ? 'bg-gray-200 dark:bg-[#2C2C2C]' : ''}`}>
              <Database size={18} />
              <span>Json Storage</span>
            </NavLink>
            {isChatPage && (
              <div className="pt-4">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 px-2 py-2">
                  <Library size={18} />
                  <span>Library</span>
                </div>
                <div className="mt-2 space-y-1">
                  {chatHistory.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className="w-full flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2C2C2C] text-left text-sm transition-colors"
                    >
                      <Clock size={14} />
                      <span className="truncate">{chat.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </nav>
    
          <div className="mt-auto space-y-4">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 px-2 py-2">
              <Command size={16} />
              <span className="text-sm">Shortcuts</span>
            </div>
    
            <div className="flex items-center justify-between px-2 py-2">
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-900 dark:text-white">melvindave</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Pro</span>
                </div>
              </div>
              <button onClick={handleOpenSettings} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>
      );
    };
    
    export default Sidebar;
