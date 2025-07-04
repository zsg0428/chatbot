"use client";

import { UIMessage } from "@ai-sdk/ui-utils";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/mark-down";
import { TypingIndicator } from "@/components/ui/TypingIndicator";
import { useEffect, useRef, useState } from "react";
import { Send, Settings, Mic } from "lucide-react";
import { SpeechButton, VoiceSelector } from "@/components/ui/speech-controls";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Voice selector - desktop version shown directly, mobile version in dialog */}
      <div className="border-b">
        {isMobile ? (
          <div className="flex justify-end p-2">
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
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl px-4 py-4">
            <div className="rounded-lg border bg-card shadow-sm">
              <div className="bg-primary/5 px-4 py-2 border-b">
                <h4 className="font-medium text-sm flex items-center gap-1.5">
                  <Mic className="h-3.5 w-3.5" />
                  Voice Settings
                </h4>
              </div>
              <div className="p-4">
                <VoiceSelector />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => {
            const messageText = message.parts
              .filter((p) => p.type === "text")
              .map((p) => p.text)
              .join(" ");
              
            return (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col gap-1",
                  message.role === "user" ? "items-end" : "items-start",
                )}
              >
                <div className="flex items-start gap-3">
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>D</AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] break-words overflow-hidden rounded-lg px-4 py-2",
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

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
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
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" disabled={status === "submitted"} className="rounded-full px-4">
            <Send className="h-4 w-4 mr-1" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};
