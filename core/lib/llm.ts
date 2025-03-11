import { ChatOpenAI } from "@langchain/openai";

declare global {
  var model: ChatOpenAI | null;
}

export const llm =
  globalThis.model ||
  new ChatOpenAI({ model: "gpt-4o-mini", apiKey: process.env.OPENAI_API_KEY });

if (process.env.NODE_ENV !== "production") {
  globalThis.model = llm;
}
