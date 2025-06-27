// app/api/chat/route.ts
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

export const runtime = "edge"; // optional: better performance

export async function POST(req: Request) {
  const { messages } = await req.json();

  const openrouter = createOpenRouter({
    apiKey: process.env.DEEPSEEK_API_KEY!,
  });

  const result = await streamText({
    model: openrouter("deepseek/deepseek-r1-0528:free"),
    messages, // Chat history from useChat()
    temperature: 0.3,
    system: "You are a cool assistant, try to be funny and helpful",
  });

  return result.toDataStreamResponse();
}
