import { forwardRef, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
  placeholder?: string;
  isListening?: boolean;
  onToggleListening?: () => void;
}

const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ value, onChange, onSend, disabled, placeholder = 'Type a message...', isListening, onToggleListening }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Merge refs
    useEffect(() => {
      if (ref && textareaRef.current) {
        if (typeof ref === 'function') {
          ref(textareaRef.current);
        } else {
          ref.current = textareaRef.current;
        }
      }
    }, [ref]);

    // Auto-height adjustment function (max 4 lines / 96px)
    const adjustHeight = (textarea: HTMLTextAreaElement) => {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 96); // Max 4 lines
      textarea.style.height = `${newHeight}px`;
    };

    // Handle textarea changes
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      adjustHeight(e.target);
    };

    // Handle Enter vs Shift+Enter key presses
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (value.trim()) {
          onSend();
          // Reset height after sending
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
          }
        }
      }
    };

    // Reset height when value is cleared
    useEffect(() => {
      if (!value && textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }, [value]);

    return (
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={`flex-1 px-4 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none max-h-24 overflow-y-auto disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:text-neutral-400 dark:disabled:text-neutral-500 transition-all duration-200 ease-out ${isListening ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : ''}`}
          style={{ minHeight: '44px' }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
        />

        {onToggleListening && (
          <button
            onClick={onToggleListening}
            disabled={disabled && !isListening}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ease-out shadow-sm hover:shadow-md flex-shrink-0 ${isListening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
              }`}
            aria-label={isListening ? "Stop recording" : "Start recording"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        )}

        {value.trim() && (
          <button
            onClick={onSend}
            disabled={disabled || !value.trim()}
            className="w-10 h-10 rounded-full bg-primary-500 hover:bg-primary-600 flex items-center justify-center transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm hover:shadow-md flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;
