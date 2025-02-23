
import { useState } from "react";
import { useDashboardState } from "./useDashboardState";

const CLAUDE_API_KEY = "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";
const API_URL = "https://api.anthropic.com/v1/messages";

export const useAIAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { menuItems, orders, reservations, staff } = useDashboardState();

  const generateSystemPrompt = () => {
    const menuSummary = menuItems.map(item => `${item.name} - $${item.price}`).join(", ");
    const staffCount = staff.length;
    const reservationCount = reservations.length;

    return `You are an AI assistant for our restaurant. Here's the current information:
    - Menu Items: ${menuSummary}
    - Staff Count: ${staffCount}
    - Current Reservations: ${reservationCount}
    Please provide accurate and helpful responses based on this information.`;
  };

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",
          max_tokens: 1000,
          messages: [
            { role: "system", content: generateSystemPrompt() },
            { role: "user", content: message }
          ]
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI assistant");
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    error
  };
};
