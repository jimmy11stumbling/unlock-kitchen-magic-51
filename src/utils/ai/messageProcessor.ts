
import type { Message } from "@/types/staff";

export const sanitizeMessage = (message: string): string => {
  return message.trim();
};

export const validateMessage = (message: string): boolean => {
  return message.trim().length > 0;
};

export const formatMessageHistory = (messages: Message[]): {
  role: "user" | "assistant";
  content: string;
}[] => {
  return messages.map(msg => ({
    role: msg.role,
    content: sanitizeMessage(msg.content)
  }));
};

export const processAssistantResponse = (response: any): string | null => {
  if (!response?.content?.[0]?.text) {
    return null;
  }
  return sanitizeMessage(response.content[0].text);
};
