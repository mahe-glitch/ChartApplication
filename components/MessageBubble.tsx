import React from 'react';
import { Message, Sender } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  // Format time (e.g., "10:30 AM")
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in-up`}>
      <div
        className={`relative max-w-[80%] px-4 py-2 shadow-sm break-words
          ${isUser 
            ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
            : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm'
          }
          ${message.isError ? 'bg-red-50 border-red-200 text-red-600' : ''}
        `}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <div 
          className={`text-[10px] mt-1 w-full flex 
            ${isUser ? 'justify-end text-blue-100' : 'justify-end text-gray-400'}
          `}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;