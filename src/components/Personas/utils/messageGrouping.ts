/**
 * Message Grouping Utility
 * 
 * Handles the logic for grouping consecutive messages from the same sender
 * and detecting time gaps between messages for better visual organization.
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isGroupStart?: boolean;
  isGroupEnd?: boolean;
  isGroupMiddle?: boolean;
}

/**
 * Time gap threshold in minutes for breaking message groups
 */
const TIME_GAP_THRESHOLD_MINUTES = 5;

/**
 * Groups messages by detecting consecutive messages from the same sender
 * and time gaps between messages.
 * 
 * @param messages - Array of messages to group
 * @returns Array of messages with grouping flags added
 * 
 * @example
 * const messages = [
 *   { id: '1', role: 'user', content: 'Hello', timestamp: new Date() },
 *   { id: '2', role: 'user', content: 'How are you?', timestamp: new Date() },
 *   { id: '3', role: 'assistant', content: 'I am fine', timestamp: new Date() }
 * ];
 * const grouped = groupMessages(messages);
 * // First message: isGroupStart=true, isGroupEnd=false
 * // Second message: isGroupStart=false, isGroupEnd=true
 * // Third message: isGroupStart=true, isGroupEnd=true (standalone)
 */
export function groupMessages(messages: Message[]): Message[] {
  if (messages.length === 0) {
    return [];
  }

  return messages.map((msg, index) => {
    const prevMsg = messages[index - 1];
    const nextMsg = messages[index + 1];
    
    // Check if previous message is from same sender
    const isSameSenderAsPrev = prevMsg?.role === msg.role;
    
    // Check if next message is from same sender
    const isSameSenderAsNext = nextMsg?.role === msg.role;
    
    // Calculate time gap from previous message (in minutes)
    const timeSincePrev = prevMsg 
      ? (msg.timestamp.getTime() - prevMsg.timestamp.getTime()) / 1000 / 60
      : Infinity;
    
    // Determine if there's a significant time gap (5+ minutes)
    const hasTimeGap = timeSincePrev > TIME_GAP_THRESHOLD_MINUTES;
    
    // Determine grouping flags
    const isGroupStart = !isSameSenderAsPrev || hasTimeGap;
    const isGroupEnd = !isSameSenderAsNext;
    const isGroupMiddle = isSameSenderAsPrev && isSameSenderAsNext && !hasTimeGap;
    
    return {
      ...msg,
      isGroupStart,
      isGroupEnd,
      isGroupMiddle
    };
  });
}
