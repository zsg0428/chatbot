// app/api/chat/route.ts
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { togetherai, createTogetherAI } from "@ai-sdk/togetherai";
import { CHAT_SYSTEM_PROMPT } from "@/common/prompts";

export const runtime = "edge"; // optional: better performance

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // openRouter
    // const openrouter = createOpenRouter({
    //   apiKey: process.env.DEEPSEEK_API_KEY!,
    // });

    //   togetherAI
    const togetherai = createTogetherAI({
      apiKey: process.env.TOGETHER_API_KEY!,
    });

    const result = await streamText({
      // model: openrouter("deepseek/deepseek-r1-0528:free"),
      // model: openrouter("deepseek/deepseek-chat-v3-0324:free"),
      model: togetherai("meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"),
      // model: togetherai("Qwen/Qwen2.5-32B"),
      messages, // Chat history from useChat()
      temperature: 0.3,
      system: CHAT_SYSTEM_PROMPT,
    });

    // const text = await result.consumeStream()
    //   console.log("text==>", text)

    // console.log("streaming Text result==>", result.toDataStreamResponse())
    return result.toDataStreamResponse();
  } catch (e) {
    console.error("API error:", e);
    return new Response("Internal server error", { status: 500 });
  }
}
