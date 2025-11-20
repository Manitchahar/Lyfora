import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Persona } from '../../lib/personas';
import { groupMessages, Message } from './utils/messageGrouping';
import MessageBubble from './MessageBubble';
import { ErrorNotification } from './ErrorNotification';
import ChatInput from './ChatInput';

interface PersonaChatProps {
  persona: Persona;
}

export default function PersonaChat({ persona }: PersonaChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  // Voice Functions
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.start();
    } else {
      alert('Voice input is not supported in this browser.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const speak = (text: string) => {
    if (!voiceEnabled || !synthesisRef.current) return;

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    synthesisRef.current.speak(utterance);
  };

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

  // Handle scroll to detect if user is near bottom
  const handleScroll = useCallback(() => {
    if (!messageContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    setShouldAutoScroll(isNearBottom);
  }, []);

  // Debounced scroll handler with 100ms delay
  const debouncedHandleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      handleScroll();
    }, 100);
  }, [handleScroll]);

  // Cleanup scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Auto-scroll to latest message only if shouldAutoScroll is true
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, shouldAutoScroll]);

  // Ensure focus returns to input after sending message
  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

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
        speak(data.response);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (overrideInput?: string) => {
    // Input validation
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || loading) return;

    const messageContent = textToSend.trim();

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

  // Group messages for rendering with grouping flags
  const groupedMessages = useMemo(() => groupMessages(messages), [messages]);

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
        <button
          onClick={() => {
            setVoiceEnabled(!voiceEnabled);
            if (voiceEnabled && synthesisRef.current) {
              synthesisRef.current.cancel();
            }
          }}
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors"
          title={voiceEnabled ? "Mute voice" : "Enable voice"}
          aria-label={voiceEnabled ? "Mute voice output" : "Enable voice output"}
        >
          {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Messages Area */}
      <div
        ref={messageContainerRef}
        onScroll={debouncedHandleScroll}
        className="flex-1 overflow-y-auto py-4 space-y-3 overscroll-contain"
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin'
        }}
      >
        {groupedMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} transition-opacity duration-200 ease-out`}
          >
            <MessageBubble
              message={message}
              isGroupStart={message.isGroupStart || false}
              isGroupEnd={message.isGroupEnd || false}
              isGroupMiddle={message.isGroupMiddle || false}
            />
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

      {/* Visually hidden status div for screen reader announcements */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {loading && "AI is typing..."}
        {error && `Error: ${error}`}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div
        className="pt-4 border-t border-neutral-200 dark:border-neutral-700 flex-shrink-0 relative"
      >
        {/* Error Notification */}
        <ErrorNotification
          error={error}
          onRetry={lastFailedMessage ? handleRetry : undefined}
          onDismiss={() => setError(null)}
        />

        {/* Chat Input */}
        <ChatInput
          ref={inputRef}
          value={input}
          onChange={setInput}
          onSend={handleSendMessage}
          disabled={loading}
          placeholder={isListening ? "Listening..." : "Type a message..."}
          isListening={isListening}
          onToggleListening={toggleListening}
        />
      </div>
    </div>
  );
}
