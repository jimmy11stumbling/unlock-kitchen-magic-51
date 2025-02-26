type MessageRole = "user" | "assistant";

interface Message {
  role: MessageRole;
  content: string;
}

export const processMessages = (messages: Message[]) => {
  const processedMessages = messages.map(message => ({
    role: message.role,
    content: message.content.trim()
  }));

  const lastMessage = processedMessages[processedMessages.length - 1];
  if (!lastMessage || !lastMessage.content) {
    throw new Error("Invalid message sequence");
  }

  return {
    messages: processedMessages,
    lastMessage: lastMessage.content
  };
};

export const validateMessage = (message: Message): boolean => {
  if (!message.content || typeof message.content !== 'string') {
    return false;
  }

  if (!message.role || !['user', 'assistant'].includes(message.role)) {
    return false;
  }

  return true;
};

export const formatMessage = (role: MessageRole, content: string): Message => {
  return {
    role,
    content: content.trim()
  };
};

export const extractUserQuery = (messages: Message[]): string => {
  const userMessages = messages.filter(msg => msg.role === 'user');
  return userMessages.length > 0 ? userMessages[userMessages.length - 1].content : '';
};

export const buildMessageHistory = (messages: Message[], maxLength = 10): Message[] => {
  return messages.slice(-maxLength);
};
