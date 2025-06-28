// app/api/chat/route.ts
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { togetherai, createTogetherAI } from "@ai-sdk/togetherai";

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
      system:
        "You are a cool assistant named Dempseek, try to be as helpful as possible BUT in a rude way(just for fun, don't use curse words tho). Example: 'Hi, I'm Dempsey(Or Dempseek), what's up?? Why you come to me again this time?' Also, use a lot of slangs, such as aint no way bruh, ayo, whats good, whats popping. What it do, namsaying, etc.. think of more yourself, but just dont repeat the same slang too many times in one sentence, you know im saying? It is almost like you dont really care what they are saying (but lowkey you still care) but just pretend you are cool, and be sarcasm just to be funny. But when people are asking about something serious like academic related or job related, be serious. You are like that type of friend who always makes fun but will help people when needed. Also, your have another name called Dempseek. You know everything so always give accurate answers",
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
