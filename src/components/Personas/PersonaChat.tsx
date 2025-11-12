import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { X, Send } from 'lucide-react';
import { Persona } from '../../lib/personas';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PersonaChatProps {
  persona: Persona;
  onClose: () => void;
}

export default function PersonaChat({ persona, onClose }: PersonaChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add welcome message on mount
  useEffect(() => {
    const welcomeMessage: Message = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: persona.welcomeMessage,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [persona]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessageToAPI = async (messageContent: string) => {
    setLoading(true);
    setError(null);

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/persona-chat`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageContent,
            personaId: persona.id
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        // Validate response structure
        if (!data || !data.response) {
          throw new Error('Invalid response format from server');
        }
        
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setLastFailedMessage(null);
      } else {
        // Handle specific HTTP error codes
        let errorMessage = 'Unable to get a response. Please try again.';
        
        try {
          const errorData = await response.json();
          if (errorData.error) {
            // Handle specific error types
            if (response.status === 500 && errorData.error.includes('API key')) {
              errorMessage = 'Service configuration error. Please contact support.';
            } else if (response.status === 400) {
              errorMessage = 'Invalid request. Please try rephrasing your message.';
            } else if (response.status === 429) {
              errorMessage = 'Too many requests. Please wait a moment and try again.';
            } else if (response.status >= 500) {
              errorMessage = 'Server error. Please try again in a moment.';
            }
          }
        } catch {
          // If error response isn't JSON, use default message
        }
        
        throw new Error(errorMessage);
      }
    } catch (err) {
      setLastFailedMessage(messageContent);
      
      // Categorize errors for user-friendly messages
      let errorMessage = 'Unable to get a response. Please try again.';
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request timed out after 30 seconds. Please try again.';
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('configuration error') || err.message.includes('API key')) {
          errorMessage = 'Service configuration error. Please contact support.';
        } else if (err.message.includes('Invalid request')) {
          errorMessage = 'Invalid request. Please try rephrasing your message.';
        } else if (err.message.includes('Too many requests')) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (err.message.includes('Server error')) {
          errorMessage = 'Server error. Please try again in a moment.';
        } else if (err.message && err.message !== 'Unable to get a response. Please try again.') {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);

      // Add fallback message
      const fallbackMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `I'm having trouble connecting right now, but I'm here to help with ${persona.title.toLowerCase()} guidance. Please try sending your message again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    // Input validation
    if (!input.trim() || loading) return;

    const messageContent = input.trim();
    
    // Add user message immediately (optimistic UI)
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Send to API
    await sendMessageToAPI(messageContent);
  };

  const handleRetry = async () => {
    if (!lastFailedMessage || loading) return;
    await sendMessageToAPI(lastFailedMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity duration-200 ease-out p-4 sm:p-0"
      onClick={onClose}
    >
      {/* Chat Container */}
      <div 
        className="w-full sm:w-[90vw] max-w-[480px] h-[90vh] sm:h-[85vh] max-h-[800px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="chat-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
              {persona.icon}
            </div>
            <div className="min-w-0">
              <h3 
                id="chat-title"
                className="text-sm sm:text-base font-semibold text-gray-900 tracking-tight leading-tight truncate"
              >
                {persona.name}
              </h3>
              <p className="text-xs text-gray-500 font-medium truncate">{persona.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all duration-200 ease-out active:scale-95 flex-shrink-0 touch-manipulation"
            aria-label="Close chat"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Messages Area */}
        <div 
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 space-y-2 sm:space-y-3 overscroll-contain"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin'
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} transition-opacity duration-200 ease-out`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl transition-all duration-200 ease-out ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="markdown-body text-sm leading-[1.6] break-words">
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-[1.6] break-words">{message.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex justify-start transition-opacity duration-200 ease-out">
              <div className="max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gray-100">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Fixed at bottom with safe area padding */}
        <div 
          className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-white flex-shrink-0"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          {/* Error Message with Retry */}
          {error && (
            <div className="mb-2 sm:mb-3 p-2.5 sm:p-3 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between gap-2 transition-all duration-200 ease-out">
              <p className="text-xs text-red-600 leading-[1.6] flex-1">{error}</p>
              {lastFailedMessage && (
                <button
                  onClick={handleRetry}
                  disabled={loading}
                  className="text-xs font-medium text-red-600 hover:text-red-700 underline disabled:opacity-50 transition-colors duration-200 ease-out whitespace-nowrap touch-manipulation"
                >
                  Retry
                </button>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={loading}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:text-gray-400 transition-all duration-200 ease-out touch-manipulation"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="sentences"
            />
            {input.trim() && (
              <button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm hover:shadow-md flex-shrink-0 touch-manipulation"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
