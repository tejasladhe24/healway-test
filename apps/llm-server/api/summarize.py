from fastapi.routing import APIRouter
from fastapi.responses import JSONResponse
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import SystemMessage, HumanMessage 
from lib.llm import llm_openai
from pydantic import BaseModel, Field
from typing import List

summarize_router = APIRouter()

class SummaryStructure(BaseModel):
    deep_summary: str = Field(..., description="Thorough summary of the conversation")
    quick_summary: str = Field(..., description="Brief summary of the conversation")
    key_points: List[str] = Field(..., description="Key points of the conversation")
    patient_condition: List[str] = Field(..., description="Possible conditions the patient is facing")
    suggested_response: str = Field(..., description="Suggested response to the patient")

class SummarizeRequest(BaseModel):
    conversation: str = Field(..., description="Conversation to summarize")

@summarize_router.post("/with-text")
def summarize_with_text(q: SummarizeRequest):

    prompt = ChatPromptTemplate.from_template(
        """You are a helpful assistant to a therapist. Following is the conversation between two persons, a therapist and a patient. 
        Summarize with text and help the therapist understand the patient's problem. Emphasize the key points and provide a brief summary.
        Give attention to the patient's feelings and emotions. Also describe to the therapist what are the possible conditions patients is facing or suffering from and 
        suggest how to respond to the patient.
        
        
        {conversation}
        """
    )

    chain = prompt | llm_openai.with_structured_output(SummaryStructure)

    res = chain.invoke({"conversation": q.conversation})

    return JSONResponse(content=res.__dict__)
