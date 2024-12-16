import React from 'react';
    import Sidebar from './components/Sidebar';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import HomePage from './pages/HomePage';
    import ChatPage from './pages/ChatPage';
    import ConverterPage from './pages/ConverterPage';
    import LibraryPage from './pages/LibraryPage';
    import EditorPage from './pages/EditorPage';
    import JsonStoragePage from './pages/JsonStoragePage';
    import { ChatProvider } from './context/ChatContext';
    
    export default function App() {
      return (
        <Router>
          <ChatProvider>
            <div className="flex h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors">
              <Sidebar />
              <main className="flex-1 overflow-auto">
                <div className="max-w-5xl mx-auto px-4 py-6">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/converter" element={<ConverterPage />} />
                    <Route path="/library" element={<LibraryPage />} />
                    <Route path="/editor" element={<EditorPage />} />
                    <Route path="/json-storage" element={<JsonStoragePage />} />
                  </Routes>
                </div>
              </main>
            </div>
          </ChatProvider>
        </Router>
      );
    }
