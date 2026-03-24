import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get the first few messages to determine the topic
    const conversationContext = messages
      .slice(0, 4)
      .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
      .join('\n');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `You are a title generator. Generate a short, descriptive title (3-6 words max) for a mental wellness conversation based on the topic discussed. 
            
Rules:
- Be specific about the topic (e.g., "Exam Stress Discussion", "Feeling Lonely Today", "Sleep Issues Help")
- Use friendly, non-clinical language
- Don't use generic titles like "Chat" or "Conversation"
- Respond with ONLY the title, nothing else
- No quotes or punctuation at the end`
          },
          {
            role: "user",
            content: `Generate a title for this conversation:\n\n${conversationContext}`
          }
        ],
        max_tokens: 50,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate title");
    }

    const data = await response.json();
    const title = data.choices?.[0]?.message?.content?.trim() || "New Chat";

    return new Response(
      JSON.stringify({ title }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (e) {
    console.error("Generate title error:", e);
    return new Response(
      JSON.stringify({ title: "New Chat", error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
