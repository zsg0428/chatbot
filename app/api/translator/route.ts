import { createTogetherAI } from "@ai-sdk/togetherai";
import { streamText } from "ai";
import { TRANSLATOR_SYSTEM_PROMPT } from "@/common/prompts";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const togetherAI = createTogetherAI({
    apiKey: process.env.TOGETHER_API_KEY!,
  });
  const model = togetherAI("meta-llama/Llama-3.3-70B-Instruct-Turbo-Free");

  try {
    const result = await streamText({
      model,
      system: TRANSLATOR_SYSTEM_PROMPT,
      messages,
    });
    return result.toDataStreamResponse();
  } catch (e) {
    console.error("Error translating text:", e);
    return new Response("Error translating text", { status: 500 });
  }
}
