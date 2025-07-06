"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Languages, Settings, Mic, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Markdown } from "@/components/ui/mark-down";
import { TypingIndicator } from "@/components/ui/TypingIndicator";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SpeechButton, VoiceSelector } from "@/components/ui/speech-controls";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Translator() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "/api/translator",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex w-full flex-col items-center pt-6 md:pt-10">
        <Label
          htmlFor="Translator"
          className="flex flex-col justify-center text-center font-mono text-xl md:text-2xl"
        >
          <span className="font-extrabold tracking-wider underline decoration-2 underline-offset-4">
            Dempseek AI Translator
          </span>
          <span className="text-sm md:text-base">No Bullshit, just pure translation</span>
          <span className="text-xs md:text-sm italic">
            Type any words or phrases to get started!
          </span>
        </Label>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 md:mt-16 flex w-full flex-col items-center justify-center gap-4 px-4 md:flex-row md:gap-2"
        >
          <Input
            type="text"
            className="h-10 w-full md:w-1/3"
            value={input}
            onChange={handleInputChange}
            disabled={status === "streaming" || status === "submitted"}
          />
          <Button
            className="h-10"
            type="submit"
            disabled={status === "streaming" || status === "submitted"}
          >
            <Languages className="h-4 w-4 mr-2" />
            {status === "streaming" ? "Translating..." : "Translate"}
          </Button>
        </form>
      </div>

      {/* Voice selector - popup dialog for both mobile and desktop */}
      <div className="mt-4 flex justify-end px-4">
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

      {/*Content Area*/}
      <ScrollArea className="my-4 flex-1 overflow-y-auto p-4">
        <div className="flex h-full flex-col space-y-4 max-w-3xl mx-auto">
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
                <div className={cn(
                  "flex items-start gap-3",
                )}>
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
          {status === "streaming" && <TypingIndicator />}
        </div>
      </ScrollArea>
    </div>
  );
}
