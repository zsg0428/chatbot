import { createTogetherAI } from "@ai-sdk/togetherai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const togetherAI = createTogetherAI({
    apiKey: process.env.TOGETHER_API_KEY!,
  });

  try {
  } catch (e) {
    console.error("Error translating text:", e);
    return new Response("Error translating text", { status: 500 });
  }
}
