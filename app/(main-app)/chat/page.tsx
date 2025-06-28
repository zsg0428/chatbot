"use client";

import { useChat } from "@ai-sdk/react";
import { ChatBot } from "@/components/ChatBot";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, status } =
    useChat();
    console.log("messages==>", messages);
    console.log("status==>", status);
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
