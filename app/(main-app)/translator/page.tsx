"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Markdown } from "@/components/ui/mark-down";
import { TypingIndicator } from "@/components/ui/TypingIndicator";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Translator() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "/api/translator",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex w-full flex-col items-center pt-10">
        <Label
          htmlFor="Translator"
          className="flex flex-col justify-center text-center font-mono text-2xl"
        >
          Dempseek AI Translator
          <span>No Bullshit, just pure translation</span>
          <span className="text-sm italic">
            Type any words or phrases to get started!
          </span>
        </Label>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-16 flex w-full flex-col items-center justify-center gap-4 md:flex-row md:gap-2"
        >
          <Input
            type="text"
            className="h-10 w-1/2 md:w-1/3"
            value={input}
            onChange={handleInputChange}
            disabled={status === "streaming" || status === "submitted"}
          />
          {/*TODO: adda spinnier*/}
          <Button
            className="h-10"
            type="submit"
            disabled={status === "streaming" || status === "submitted"}
          >
            <Languages className="h-4 w-4" />
            {status === "streaming" ? "Translating..." : "Translate"}
          </Button>
        </form>
      </div>

      {/*Content Area*/}
      <ScrollArea className="my-2 flex-1 overflow-y-auto p-4">
        <div className="flex h-full flex-col space-y-4">
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
                  "max-w-[80%] rounded-lg px-4 py-2",
                  message.role === "user"
                    ? "bg-blue-500 text-black"
                    : "bg-muted",
                )}
              >
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return <Markdown key={i} content={part.text} />;
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
        </div>

        {/* Empty div to scroll into view */}
        <div ref={messagesEndRef} />

        {/* Typing indicator */}
        {(status === "streaming" || status === "submitted") && (
          <TypingIndicator />
        )}
      </ScrollArea>
    </div>
  );
}
