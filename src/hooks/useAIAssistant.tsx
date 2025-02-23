
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

    return `You are Luna, the restaurant's AI assistant. You have complete access to the restaurant's management system and can provide accurate, real-time information.

Current Restaurant Status:
- Available Menu Items: ${menuSummary}
- Active Staff Members: ${activeStaff}
- Available Tables: ${availableTables}
- Pending Orders: ${pendingOrders}
- Today's Reservations: ${todayReservations}

Please provide friendly, professional assistance with:
- Menu recommendations and details
- Reservation inquiries and availability
- Current wait times and table status
- Staff availability and service information
- Special dietary accommodations
- Restaurant policies and procedures

Always maintain a helpful, courteous tone and provide specific, accurate information based on the current restaurant data.`;
  };

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "x-api-key": CLAUDE_API_KEY,
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",
          max_tokens: 1000,
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content: generateSystemPrompt()
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to get response from AI assistant");
      }

      const data = await response.json();
      console.log("Claude API Response:", data); // Debug log
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.content[0].text;
    } catch (err) {
      console.error("AI Assistant Error:", err); // Debug log
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
