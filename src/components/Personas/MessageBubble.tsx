import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from './utils/messageGrouping';

interface MessageBubbleProps {
  message: Message;
  isGroupStart: boolean;
  isGroupEnd: boolean;
  isGroupMiddle: boolean;
}

/**
 * MessageBubble Component
 * 
 * Displays a single message bubble with proper styling, alignment, and grouping.
 * Supports markdown rendering for AI messages and handles message grouping
 * for consecutive messages from the same sender.
 * 
 * Requirements:
 * - 1.1: User messages aligned right with 16px margin
 * - 1.2: AI messages aligned left with 16px margin
 * - 1.3: 12px vertical spacing between bubbles
 * - 1.4: No overlapping regardless of content length
 * - 1.5: Max 85% width of container
 * - 2.1: User messages with primary color background and white text
 * - 2.2: AI messages with neutral background and theme-appropriate text
 * - 2.3: Distinct border radius for user messages (18px/4px)
 * - 2.4: Distinct border radius for AI messages (18px/4px)
 * - 2.5: 4.5:1 contrast ratio in light and dark modes
 * - 3.1: Text wrapping without horizontal overflow
 * - 3.2: Markdown rendering for AI messages
 * - 3.3: 12px horizontal, 10px vertical padding
 * - 3.4: Preserve line breaks and whitespace
 * - 3.5: Max 600px width on large screens
 */
const MessageBubble = memo(({ message, isGroupStart, isGroupEnd, isGroupMiddle }: MessageBubbleProps) => {
  const isUser = message.role === 'user';
  
  // Determine border radius based on grouping position
  const getBorderRadiusClasses = () => {
    // Standalone message (not grouped)
    if (isGroupStart && isGroupEnd) {
      return 'rounded-[18px]';
    }
    
    if (isUser) {
      // User messages (right-aligned)
      if (isGroupStart) {
        // First in group: full rounded top, slight rounded bottom-left, tight bottom-right
        return 'rounded-t-[18px] rounded-bl-[18px] rounded-br-[4px]';
      } else if (isGroupMiddle) {
        // Middle of group: slight rounded left, tight right
        return 'rounded-l-[18px] rounded-r-[4px]';
      } else if (isGroupEnd) {
        // Last in group: slight rounded top-left, tight top-right, full rounded bottom
        return 'rounded-tl-[18px] rounded-tr-[4px] rounded-b-[18px]';
      }
    } else {
      // AI messages (left-aligned)
      if (isGroupStart) {
        // First in group: full rounded top, slight rounded bottom-right, tight bottom-left
        return 'rounded-t-[18px] rounded-br-[18px] rounded-bl-[4px]';
      } else if (isGroupMiddle) {
        // Middle of group: slight rounded right, tight left
        return 'rounded-r-[18px] rounded-l-[4px]';
      } else if (isGroupEnd) {
        // Last in group: slight rounded top-right, tight top-left, full rounded bottom
        return 'rounded-tr-[18px] rounded-tl-[4px] rounded-b-[18px]';
      }
    }
    
    // Fallback (should not reach here)
    return 'rounded-[18px]';
  };
  
  // Base classes for all message bubbles
  const baseClasses = 'px-3 py-2.5 break-words transition-all duration-200 ease-out';
  
  // Width constraints: 85% max, 600px max on large screens
  const widthClasses = 'max-w-[85%] lg:max-w-[600px]';
  
  // Alignment and color classes based on role
  const roleClasses = isUser
    ? 'ml-auto mr-4 bg-primary-500 text-white shadow-sm'
    : 'mr-auto ml-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100';
  
  // Border radius classes
  const borderRadiusClasses = getBorderRadiusClasses();
  
  // Combine all classes
  const bubbleClasses = `${baseClasses} ${widthClasses} ${roleClasses} ${borderRadiusClasses}`;
  
  return (
    <div className={bubbleClasses}>
      {isUser ? (
        // User messages: plain text with preserved whitespace
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      ) : (
        // AI messages: markdown rendering
        <div className="markdown-body text-sm leading-relaxed">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  // Only re-render if message content, id, or grouping flags change
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.isGroupStart === nextProps.isGroupStart &&
    prevProps.isGroupEnd === nextProps.isGroupEnd &&
    prevProps.isGroupMiddle === nextProps.isGroupMiddle
  );
});

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
