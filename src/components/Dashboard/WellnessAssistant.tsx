import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Bot, User, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function WellnessAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your wellness assistant. I can help with motivation, wellness tips, and guidance on your health journey. How can I support you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

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

  const speak = (text: string) => {
    if (!voiceEnabled || !synthesisRef.current) return;

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    synthesisRef.current.speak(utterance);
  };

  const handleSendMessage = async (overrideInput?: string) => {
    const messageText = overrideInput || input;
    if (!messageText.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wellness-assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        speak(data.response);
      } else {
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm here to support your wellness journey! Remember to stay hydrated, take breaks, and be kind to yourself.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, fallbackMessage]);
        speak(fallbackMessage.content);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm here to help! Focus on small, consistent steps toward your wellness goals. What area would you like to improve?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      speak(errorMessage.content);
    }

    setLoading(false);
  };

  const quickPrompts = [
    "Give me motivation for today",
    "Tips for better sleep",
    "How to manage stress?",
    "Healthy snack ideas",
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl flex flex-col z-50 transition-colors duration-300">
      <div className="bg-teal-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Wellness Assistant</h3>
            <p className="text-xs text-white/80">Here to support you</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setVoiceEnabled(!voiceEnabled);
              if (voiceEnabled && synthesisRef.current) {
                synthesisRef.current.cancel();
              }
            }}
            className="text-white/80 hover:text-white p-1 rounded-lg transition"
            title={voiceEnabled ? "Mute voice" : "Enable voice"}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 w-8 h-8 rounded-lg transition flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user' ? 'bg-teal-100 dark:bg-teal-900/30' : 'bg-gray-100 dark:bg-neutral-700'
                }`}
            >
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              ) : (
                <Bot className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${message.role === 'user'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-gray-100'
                }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="bg-gray-100 dark:bg-neutral-700 rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-gray-700 dark:text-gray-200 rounded-full transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isListening ? "Listening..." : "Ask me anything..."}
            className={`flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500 ${isListening ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : ''}`}
          />
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition ${isListening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-gray-600 dark:text-gray-300'
              }`}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 bg-teal-500 hover:bg-teal-600 text-white rounded-full flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          This is not medical advice. Consult a healthcare professional for health concerns.
        </p>
      </div>
    </div>
  );
}
