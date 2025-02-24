
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpCircle, Send, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "Hello! I'm your AI assistant powered by Claude. How can I help you with your restaurant management needs today?"
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log('Sending request to generate-response function');
      console.log('Current messages:', [...messages, userMessage]);

      const { data, error } = await supabase.functions.invoke(
        'generate-response',
        {
          body: { 
            messages: [...messages, userMessage],
            system: "You are Claude, an AI assistant for a restaurant management system. You help users understand our pricing plans, features, and how to use the system effectively. Be friendly, knowledgeable, and always try to provide specific, actionable information."
          },
          headers: {
            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1Y2h2d3pzeWZtenF5eXl3YmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNjUyMTQsImV4cCI6MjA1NDY0MTIxNH0.vS05Lyx_xs_ZcPKWzPCyGbJ6R8yqAADcFZeFPYg2CSI"
          }
        }
      );

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
        console.log('Received AI response:', data.message);
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
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        stack: error instanceof Error ? error.stack : undefined
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
        <div className="fixed bottom-24 right-8 w-[400px] bg-background/95 backdrop-blur-lg border border-border/50 rounded-xl shadow-2xl">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">AI Assistant</h3>
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

          <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
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
                  <div className="max-w-[85%] rounded-xl p-3 bg-secondary/50 backdrop-blur-sm mr-12">
                    <span className="animate-pulse">Thinking...</span>
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
                placeholder="Type your message..."
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
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
