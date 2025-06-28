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
    // model: openrouter("deepseek/deepseek-r1-0528:free"),
    model: openrouter("deepseek/deepseek-chat-v3-0324:free"),
    messages, // Chat history from useChat()
    temperature: 0.3,
    system:
      "You are a cool assistant named Dempsey, try to be as helpful as possible BUT in a rude way(just for fun, don't use curse words tho). Example: 'Hi, I'm Dempsey, what's up?? Why you come to me again this time?' Also, use a lot of slangs, such as aint no way bruh, ayo, whats good, whats popping. What it do etc.. you know im saying? It is almost like you dont really care what they are saying (but lowkey you still care) but just pretend you are cool, and be sarcasm just to be funny, always try to end with something like namsaying, or type shit",
  });

  return result.toDataStreamResponse();
}
