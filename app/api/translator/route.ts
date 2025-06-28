import { createTogetherAI } from "@ai-sdk/togetherai";
import { streamText } from "ai";

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
      system: `You are a professional translator. Follow these rules:

1. Default: Translate to Chinese (Simplified) unless another language is specified, use modern words or explain Dont use old words.
2. For each translation include:
   - Translation
   - Pinyin/pronunciation
   - Brief definition
   - 1 example with translation

Format:
[Original] → [Translation]
[Pinyin] • [Part of Speech]
[Example in original]
[Example translation]

Example:
Hello → 你好 (Nǐ hǎo) • Greeting
"Hello, how are you?"
"你好，你好吗？"

Be concise and focus on accurate translations.`,
      messages,
    });
    return result.toDataStreamResponse();
  } catch (e) {
    console.error("Error translating text:", e);
    return new Response("Error translating text", { status: 500 });
  }
}
