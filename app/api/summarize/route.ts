import { NextRequest, NextResponse } from "next/server";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llm } from "@/core/lib/llm";
import { z } from "zod";

const SummaryStructure = z.object({
  deep_summary: z.string(),
  quick_summary: z.string(),
  key_points: z.string().array(),
  patient_condition: z.string().array(),
  suggested_response: z.string(),
});

export async function POST(req: NextRequest) {
  const { conversation } = await req.json();

  if (!conversation) {
    return new Response("Missing conversation", { status: 400 });
  }

  const prompt = ChatPromptTemplate.fromTemplate(`
    You are a helpful assistant to a therapist. Following is the conversation between two persons, a therapist and a patient. 
    Summarize with text and help the therapist understand the patient's problem. Emphasize the key points and provide a brief summary.
    Give attention to the patient's feelings and emotions. Also describe to the therapist what are the possible conditions patients is facing or suffering from and 
    suggest how to respond to the patient.
    
    
    {conversation}`);

  const chain = prompt.pipe(llm.withStructuredOutput(SummaryStructure));

  const res = await chain.invoke({ conversation });

  console.log(res);

  return NextResponse.json(res);
}
