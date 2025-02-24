
import type { Message } from "@/types/staff";

export const processAIResponse = (messages: Message[]): string => {
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || lastMessage.role !== 'assistant') return '';
  
  // Process code blocks
  return lastMessage.content.replace(
    /```([a-z]*)\n([\s\S]*?)```/g,
    '<pre><code class="language-$1">$2</code></pre>'
  );
};

export const formatUserQuery = (query: string): string => {
  return query.trim().toLowerCase();
};

export const detectIntent = (query: string): string => {
  if (query.includes('help')) return 'help';
  if (query.includes('error')) return 'error';
  if (query.includes('how')) return 'instruction';
  return 'general';
};
