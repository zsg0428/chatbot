"use client";

import { useChat } from "@ai-sdk/react";
import { ChatBot } from "@/components/ChatBot";
import { toast } from "sonner";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    // onFinish: () => {
    //   toast.success("Chat Finished");
    // },
    onError: (error) => {
      toast.error(error.message || "Something went wrong, try again");
    },
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Hi, I'm Dempseek, what's up?? How can I help you?",
      },
    ],
  });
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
