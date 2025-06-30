"use client";

import { useChat } from "@ai-sdk/react";
import { ChatBot } from "@/components/ChatBot";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function Chat() {
  const [isClient, setIsClient] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    setMessages,
  } = useChat({
    // onFinish: () => {
    //   toast.success("Chat Finished");
    // },
    onError: (error) => {
      toast.error(error.message || "Something went wrong, try again");
    },
    initialMessages: isClient
      ? [
          {
            id: "1",
            role: "assistant",
            content: "Hi, I'm Dempseek, what's up?? How can I help you?",
          },
        ]
      : [],
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="h-screen w-full pt-10">
      <ChatBot
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        status={status}
      />
    </div>
  );
}
