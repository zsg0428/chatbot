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

1. If input is in English, translate to Chinese.
2. If input is in Chinese, translate to English.
3. If input is in another language, provide:
   - Chinese translation
   - English translation

For each translation, include:
- [Original] → [Translation(s)]
- [Pinyin] • [Part of Speech]
- [Example in original language]
- [Example translation(s)]
- [A natural casual way to say it in both languages (like how young people or native speakers would say it in daily conversation). Do not label it as "slang" or "young people way". Just present it as an alternative casual phrasing.]

Format:
[Original] → [Translation] (Pinyin) • [Part of Speech]
[Example in original]
[Example translation(s)]
[Alternative casual phrasing in both languages]

Be concise and accurate. Use modern and natural words. Avoid old or unnatural phrases. At the end, provide an alternative casual phrasing in both languages as shown.
`,
      messages,
    });
    return result.toDataStreamResponse();
  } catch (e) {
    console.error("Error translating text:", e);
    return new Response("Error translating text", { status: 500 });
  }
}
