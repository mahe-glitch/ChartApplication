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

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the conversation history?")) {
      setMessages([
        {
          id: 'reset-msg-' + Date.now(),
          text: "Chat history cleared. How can I help you?",
          sender: Sender.Bot,
          timestamp: new Date(),
        },
      ]);
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
            <div className="flex items-center gap-2 h-4">
              <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${isLoading ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></span>
              <div className="text-xs text-gray-500 font-medium w-20">
                {isLoading ? <TypingStatus /> : 'Online'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Clear Chat Button */}
        <button 
          onClick={handleClearChat}
          className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
          title="Clear Chat History"
          aria-label="Clear Chat History"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
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
            <div className="flex justify-start mb-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="bg-white border border-gray-200 px-4 py-3.5 rounded-2xl rounded-tl-sm flex gap-1.5 items-center shadow-sm w-fit">
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

// Internal component for the animated text dots
const TypingStatus: React.FC = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return <span>Typing{dots}</span>;
};

export default App;