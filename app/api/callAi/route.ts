import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json(); // Parse the incoming request
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
    });
    return NextResponse.json({ response: response.text }); // Return the AI response
  } catch (error) {
    console.error("Error in callAi API:", error);
    return NextResponse.json({ error: "Failed to call AI" }, { status: 500 });
  }
}