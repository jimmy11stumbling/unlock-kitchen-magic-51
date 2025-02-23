
import { useState } from "react";
import { useDashboardState } from "./useDashboardState";

const CLAUDE_API_KEY = "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";
const API_URL = "https://api.anthropic.com/v1/messages";

export const useAIAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { menuItems, orders, reservations, staff, tables } = useDashboardState();

  const generateSystemPrompt = () => {
    const menuSummary = menuItems.map(item => `${item.name} - $${item.price}`).join(", ");
    const activeStaff = staff.filter(s => s.status === "active").length;
    const availableTables = tables.filter(t => t.status === "available").length;
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const todayReservations = reservations.filter(r => {
      const today = new Date().toISOString().split('T')[0];
      return r.date === today;
    }).length;

    return `You are Luna, the restaurant's AI assistant. You have access to the restaurant's real-time data:

Restaurant Status:
- Menu Items: ${menuSummary}
- Active Staff: ${activeStaff}
- Available Tables: ${availableTables}
- Pending Orders: ${pendingOrders}
- Today's Reservations: ${todayReservations}

Provide friendly, accurate assistance with menu details, reservations, wait times, staff info, and restaurant policies.`;
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
          system: generateSystemPrompt(),
          messages: [
            { role: "user", content: message }
          ],
          model: "claude-3-opus-20240229",
          max_tokens: 1000
        })
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to get response");
      }

      return data.content[0].text;
    } catch (err) {
      console.error("AI Assistant Error:", err);
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
