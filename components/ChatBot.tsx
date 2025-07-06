"use client";

import { UIMessage } from "@ai-sdk/ui-utils";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/mark-down";
import { TypingIndicator } from "@/components/ui/TypingIndicator";
import { useEffect, useRef, useState } from "react";
import { Send, Settings, Mic, X } from "lucide-react";
import { SpeechButton, VoiceSelector } from "@/components/ui/speech-controls";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ChatBotProps {
  messages: UIMessage[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Max height of 200px
    }
  }, [input]);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Voice selector - popup dialog for both mobile and desktop */}
      <div className="border-b py-2 px-4 flex justify-end">
        <Dialog open={showVoiceSettings} onOpenChange={setShowVoiceSettings}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Mic className="h-4 w-4" />
              <span>Voice Settings</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Voice Settings
              </DialogTitle>
            </DialogHeader>
            <VoiceSelector />
            <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full max-w-5xl mx-auto space-y-6 px-4">
          {messages.map((message) => {
            const messageText = message.parts
              .filter((p) => p.type === "text")
              .map((p) => p.text)
              .join(" ");
              
            return (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col gap-1 w-full",
                  message.role === "user" ? "items-end" : "items-start",
                )}
              >
                <div className={cn(
                  "flex items-start gap-3 max-w-[95%] sm:max-w-[85%] md:max-w-[75%]",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}>
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback>{message.role === "user" ? "You" : "D"}</AvatarFallback>
                  </Avatar>

                  <div
                    className={cn(
                      "break-words overflow-hidden rounded-lg px-4 py-2",
                      message.role === "user" ? "bg-blue-500 text-black" : "bg-muted",
                    )}
                  >
                    {message.parts.map((part, i) => {
                      if (part.type === "text" && part.text) {
                        return <Markdown key={i} content={part.text} />;
                      }
                      return null;
                    })}
                  </div>
                </div>
                
                {/* Speech button below the message bubble */}
                {message.role === "assistant" && messageText && (
                  <div className="ml-11">
                    <SpeechButton 
                      text={messageText} 
                      messageId={message.id} 
                      showSettings={false}
                    />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
          {(status === "streaming" || status === "submitted") && <TypingIndicator />}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t p-4"
      >
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 min-h-[40px] max-h-[200px] rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) {
                  handleSubmit(e as any);
                }
              }
            }}
            disabled={status === "submitted"}
          />
          <Button type="submit" disabled={status === "submitted"} className="rounded-full px-4 h-10">
            <Send className="h-4 w-4 mr-1" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};
