"use client";

import { UIMessage } from "@ai-sdk/ui-utils";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/mark-down";
import { TypingIndicator } from "@/components/ui/TypingIndicator";
import { useEffect, useRef } from "react";
import { Send } from "lucide-react";

interface ChatBotProps {
  messages: UIMessage[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  status: string;
}

export const ChatBot = ({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  status,
}: ChatBotProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]); // Re-run when messages or status changes

  return (
    <div className="flex h-full w-full flex-col">
      {/* Messages container */}
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-3",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {message.role === "assistant" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
            )}

            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2 break-words overflow-hidden",
                message.role === "user" ? "bg-blue-500 text-black" : "bg-muted",
              )}
            >
              {message.parts.map((part, i) => {
                if (part.type === "text") {
                  return (
                    <div key={i} className="break-words overflow-x-auto">
                      <Markdown content={part.text} />
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {message.role === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {/* Empty div to scroll into view */}
        <div ref={messagesEndRef} />

        {/* Typing indicator */}
        {(status === "streaming" || status === "submitted") && (
          <TypingIndicator />
        )}
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 border-t bg-background p-4"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 rounded-md border px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <Button type="submit" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
