import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import { Message, Sender } from './types';
import { getBotResponse } from './services/chatService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      text: "Hello! I'm your virtual assistant. How can I help you today?",
      sender: Sender.Bot,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    // 1. Add User Message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: Sender.User,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // 2. Get Bot Response (Gemini or Mock)
      const botResponseText = await getBotResponse(text);

      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: Sender.Bot,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      // Handle unlikely errors from the service wrapper
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, something went wrong. Please try again.",
        sender: Sender.Bot,
        timestamp: new Date(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-10 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
            AI
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg leading-tight">Simple Chat</h1>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
              <p className="text-xs text-gray-500 font-medium">{isLoading ? 'Typing...' : 'Online'}</p>
            </div>
          </div>
        </div>
        
        {/* Optional: Minimal info icon or menu could go here */}
        <button className="text-gray-400 hover:text-gray-600 transition-colors p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
        </button>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-hide">
        <div className="flex flex-col space-y-2">
          {/* Date separator example for visual polish */}
          <div className="text-center py-4">
             <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Today</span>
          </div>

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Typing Indicator Bubble */}
          {isLoading && (
            <div className="flex justify-start mb-4 animate-pulse">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center shadow-sm">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="sticky bottom-0 z-20">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default App;