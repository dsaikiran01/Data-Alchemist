import { Rule } from "@/types/rules";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Place this in .env
  dangerouslyAllowBrowser: true, // for client-side call — or proxy it server-side
});

export async function parseNaturalRule(input: string): Promise<Rule | null> {
  const messages = [
    {
      role: "system",
      content:
        "You convert plain English scheduling rules into JSON objects. Only return a single JSON rule without explanations.",
    },
    {
      role: "user",
      content: input,
    },
  ];

  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.2,
  });

  const raw = res.choices?.[0]?.message?.content || "";

  try {
    const match = raw.match(/\{[\s\S]*?\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch (e) {
    return null;
  }
}
