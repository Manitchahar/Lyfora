import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send } from 'lucide-react';
import { Persona } from '../../lib/personas';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PersonaChatProps {
  persona: Persona;
}

export default function PersonaChat({ persona }: PersonaChatProps) {
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
      className="flex flex-col h-full max-h-[70vh]"
      role="region"
      aria-labelledby="chat-title"
    >
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl flex-shrink-0">
          {persona.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 
            id="chat-title"
            className="text-base font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight truncate"
          >
            {persona.name}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">{persona.title}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto py-4 space-y-3 overscroll-contain"
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
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl transition-all duration-200 ease-out ${
                message.role === 'user'
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className="markdown-body text-sm leading-relaxed break-words">
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm leading-relaxed break-words">{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex justify-start transition-opacity duration-200 ease-out">
            <div className="max-w-[85%] px-4 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div 
        className="pt-4 border-t border-neutral-200 dark:border-neutral-700 flex-shrink-0"
      >
        {/* Error Message with Retry */}
        {error && (
          <div className="mb-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center justify-between gap-2 transition-all duration-200 ease-out">
            <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed flex-1">{error}</p>
            {lastFailedMessage && (
              <button
                onClick={handleRetry}
                disabled={loading}
                className="text-xs font-medium text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 underline disabled:opacity-50 transition-colors duration-200 ease-out whitespace-nowrap"
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
            className="flex-1 px-4 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:text-neutral-400 dark:disabled:text-neutral-500 transition-all duration-200 ease-out"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="sentences"
          />
          {input.trim() && (
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-full bg-primary-500 hover:bg-primary-600 flex items-center justify-center transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm hover:shadow-md flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
