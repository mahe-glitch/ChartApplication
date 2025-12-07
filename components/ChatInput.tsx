import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const MAX_MESSAGE_LENGTH = 1000;
const WARNING_THRESHOLD = 800;

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Only send if valid length and not empty
    if (inputValue.trim() && !isLoading && inputValue.length <= MAX_MESSAGE_LENGTH) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Keep focus on input after sending, unless mobile (to avoid keyboard popping up/down constantly)
  useEffect(() => {
    if (!isLoading && inputRef.current && window.innerWidth > 768) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const currentLength = inputValue.length;
  const isOverLimit = currentLength > MAX_MESSAGE_LENGTH;
  const isNearLimit = currentLength >= WARNING_THRESHOLD;

  // Determine styles based on length state
  let counterColor = "text-gray-400";
  if (isOverLimit) {
    counterColor = "text-red-500 font-bold";
  } else if (isNearLimit) {
    counterColor = "text-orange-500";
  }

  return (
    <div className="bg-white border-t border-gray-100 p-4 pb-6 sm:pb-4 w-full relative">
      {/* Character Counter Indicator */}
      <div className={`absolute top-1 right-6 text-[10px] font-medium transition-colors duration-200 ${counterColor}`}>
        {currentLength > 0 ? `${currentLength} / ${MAX_MESSAGE_LENGTH}` : ''}
      </div>

      <form 
        onSubmit={handleSubmit}
        className={`flex items-center gap-2 bg-gray-50 p-1.5 rounded-full border transition-all duration-200 shadow-sm
          ${isOverLimit 
            ? 'border-red-300 ring-1 ring-red-200 focus-within:border-red-500 focus-within:ring-red-500' 
            : 'border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'
          }
        `}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isLoading}
          className="flex-1 bg-transparent px-4 py-2 outline-none text-gray-800 placeholder-gray-400 disabled:opacity-50 text-sm sm:text-base"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading || isOverLimit}
          className={`
            p-2 rounded-full flex items-center justify-center transition-all duration-200
            ${!inputValue.trim() || isLoading || isOverLimit
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md'
            }
          `}
          aria-label="Send message"
        >
          {/* Send Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;