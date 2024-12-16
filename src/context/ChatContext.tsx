import React, { createContext, useContext, useState, useEffect } from 'react';

    interface ChatMessage {
      role: 'user' | 'assistant';
      content: string;
    }

    interface ChatHistoryItem {
      id: string;
      title: string;
      messages: ChatMessage[];
    }

    interface ChatContextType {
      chatHistory: ChatHistoryItem[];
      addChatToHistory: (title: string, messages: ChatMessage[], id?: string) => void;
      updateChatHistory: (id: string, messages: ChatMessage[]) => void;
      selectedChat: ChatHistoryItem | null;
      setSelectedChat: (chat: ChatHistoryItem | null) => void;
    }

    const ChatContext = createContext<ChatContextType | undefined>(undefined);

    export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
      const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
      const [selectedChat, setSelectedChat] = useState<ChatHistoryItem | null>(null);

      useEffect(() => {
        const storedChatHistory = localStorage.getItem('chatHistory');
        if (storedChatHistory) {
          setChatHistory(JSON.parse(storedChatHistory));
        }
      }, []);

      useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
      }, [chatHistory]);

      const addChatToHistory = (title: string, messages: ChatMessage[], id?: string) => {
        const newChat = { id: id || Date.now().toString(), title, messages };
        setChatHistory((prev) => [newChat, ...prev]);
      };

      const updateChatHistory = (id: string, messages: ChatMessage[]) => {
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === id ? { ...chat, messages } : chat
          )
        );
      };

      return (
        <ChatContext.Provider value={{ chatHistory, addChatToHistory, updateChatHistory, selectedChat, setSelectedChat }}>
          {children}
        </ChatContext.Provider>
      );
    };

    export const useChat = () => {
      const context = useContext(ChatContext);
      if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
      }
      return context;
    };
