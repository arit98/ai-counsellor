import { NextResponse } from "next/server";
import { streamText, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
import { z } from "zod";
import dbConnect from "@/lib/mongodb";
import University from "@/models/University";
import Profile from "@/models/Profile";
import Conversation from "@/models/Conversation";

export const maxDuration = 60;

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    const conversation = await Conversation.findOne({ userId });
    return NextResponse.json(conversation ? conversation.messages : []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { messages, userId, profile: clientProfile } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required and must be a non-empty array" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    // Fetch real university data from DB to provide to the AI
    const universities = await University.find({}).sort({ ranking: 1 });
    const uniList = universities.map(u =>
      `- ${u.name} (${u.country}): Rank #${u.ranking}, Tuition $${u.tuition.toLocaleString()}, Admission ${u.admissionRate}%`
    ).join("\n");

    // Fetch real profile data if not provided (fallback to user's db profile)
    let profileData = clientProfile;
    if (!profileData || !profileData.firstName) {
      const dbProfile = await Profile.findOne({ userId });
      if (dbProfile) profileData = dbProfile;
    }

    if (!profileData) profileData = {};

    const systemPrompt = `You are an expert study abroad counselor with deep knowledge of universities worldwide. 
    You help students find the perfect universities and successfully apply to them.
    
    Student Profile:
    - Name: ${profileData.firstName} ${profileData.lastName}
    - Citizenship: ${profileData.citizenship}
    - Current Level: ${profileData.currentLevel}
    - GPA: ${profileData.gpa}
    - Target Degree: ${profileData.degreeLevel}
    - Career Goals: ${profileData.careerGoals}
    - Preferred Countries: ${profileData.countryPreferences?.join(", ") || "Not specified"}
    - Budget: ${profileData.budgetRange || "Not specified"}
    - Intended Start: ${profileData.intendedYear || "Not specified"}
    
    Available Universities in our Database:
    ${uniList}
    
    Your responsibilities:
    1. Provide personalized university recommendations based on their profile and our database.
    2. Give advice on applications, essays, and admission requirements.
    3. Help with scholarship and funding options.
    4. Offer guidance on visa processes and requirements.
    5. Answer questions about student life abroad.
    6. Use the specific university data provided in the context when making recommendations.
    
    Be encouraging, realistic, and detailed.`;

    const result = await streamText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      messages: messages as any,
      temperature: 0.7,
      maxTokens: 1000,
      onFinish: async ({ text }) => {
        try {
          const lastUserMessage = messages[messages.length - 1];
          if (!lastUserMessage) return;

          let conv = await Conversation.findOne({ userId });
          if (!conv) {
            conv = new Conversation({ userId, messages: [] });
          }

          conv.messages.push({
            role: 'user',
            content: typeof lastUserMessage.content === 'string'
              ? lastUserMessage.content
              : (lastUserMessage as any).text || ""
          });
          conv.messages.push({ role: 'assistant', content: text });

          await conv.save();
        } catch (dbError) {
          console.error("Failed to save chat history:", dbError);
        }
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("CRITICAL error in counsellor API:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
