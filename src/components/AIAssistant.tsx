
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpCircle, Send, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "Hello! I'm your AI assistant powered by Claude. How can I help you with your restaurant management today?"
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log('Sending request to generate-response function with messages:', [...messages, userMessage]);

      const { data, error } = await supabase.functions.invoke('generate-response', {
        body: { 
          messages: [...messages, userMessage],
          system: "You are a helpful AI assistant for MaestroAI restaurant management system. Provide specific help with menu management, staff scheduling, inventory tracking, order processing, table management, kitchen workflows, customer feedback analysis, and other restaurant operations. When appropriate, suggest practical efficiency improvements based on industry best practices."
        }
      });

      console.log('Response from generate-response function:', { data, error });

      if (error) {
        console.error('Supabase Function Error:', {
          error,
          statusCode: error.status,
          statusText: error.message,
          context: error.context
        });
        
        let errorMessage = "Failed to get a response. Please try again.";
        if (error.status === 429) {
          errorMessage = "Too many requests. Please wait a moment and try again.";
        } else if (error.status === 401 || error.status === 403) {
          errorMessage = "Authentication error. Please try refreshing the page.";
        } else if (error.status === 500) {
          errorMessage = "Server error. Our team has been notified.";
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        throw error;
      }

      if (data?.message) {
        const assistantMessage = {
          role: "assistant" as const,
          content: data.message
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Unexpected response format from AI assistant');
      }
    } catch (error) {
      console.error('AI Assistant Error:', {
        error,
        timestamp: new Date().toISOString(),
        lastMessage: userMessage,
        errorType: error instanceof Error ? error.constructor.name : typeof error
      });

      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I encountered an error processing your request. Please try again or rephrase your question."
      }]);

      toast({
        title: "Error",
        description: "There was a problem getting a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Assistant"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-8 w-[400px] bg-background/95 backdrop-blur-lg border border-border/50 rounded-xl shadow-2xl z-50">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Restaurant AI Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI Assistant"
              className="hover:bg-secondary/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-[400px] p-4">
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-12"
                        : "bg-secondary/50 backdrop-blur-sm mr-12"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-xl p-3 bg-secondary/50 backdrop-blur-sm mr-12 flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about restaurant management..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                disabled={isLoading}
                size="icon"
                className="shrink-0"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
