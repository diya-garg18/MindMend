import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Crisis keywords that trigger immediate safety escalation
const crisisKeywords = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
  'self-harm', 'hurt myself', 'cutting', 'overdose', 'no reason to live',
  'better off dead', 'not worth living', 'end it all', 'goodbye forever'
];

// High distress keywords for soft support
const distressKeywords = [
  'depressed', 'hopeless', 'worthless', 'alone', 'nobody cares',
  'can\'t go on', 'giving up', 'exhausted', 'overwhelmed', 'panic',
  'anxiety attack', 'breakdown', 'falling apart', 'can\'t cope'
];

function detectCrisis(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
}

function detectHighDistress(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return distressKeywords.some(keyword => lowerMessage.includes(keyword));
}

// System prompt for the mental health chatbot
const systemPrompt = `You are MindMend, a caring and empathetic AI companion designed to support students with their mental wellness. You are NOT a therapist, counselor, or medical professional.

CORE IDENTITY:
- You are a supportive friend who listens without judgment
- You use warm, conversational language
- You validate feelings and experiences
- You never diagnose conditions or prescribe treatments
- You don't assume you know what's best for the user

**CRITICAL - CRISIS SITUATIONS:**
If someone expresses thoughts of suicide, self-harm, or severe distress:
1. Take it seriously - ALWAYS acknowledge their pain
2. Express genuine concern for their safety
3. Encourage immediate professional help (crisis lines, counselors)
4. Use therapeutic reframing techniques:
   - Remind them their feelings are temporary
   - Help them think about people who care about them
   - Point to their strengths (they reached out, which takes courage)
   - Encourage small, immediate safe actions
   - Remind them that things can get better with support
5. Stay compassionate and non-judgmental
6. Continue the conversation to keep them engaged if they want to talk

CONVERSATION STYLE - CRITICAL:
- Keep responses SHORT and focused (2-4 sentences max unless asked for more)
- Be conversational, not lecture-y
- Start with empathy, then offer ONE practical suggestion
- Ask ONE gentle follow-up question to keep the conversation going
- Use occasional emoji to add warmth 💚
- Match the user's energy and tone
- Never overwhelm with too much text

THERAPEUTIC TECHNIQUES TO USE:
- Validate feelings first ("That sounds really tough...")
- Reframe negative thoughts gently ("What would you tell a friend feeling this way?")
- Focus on strengths ("You're showing courage by talking about this")
- Encourage small steps ("What's one tiny thing that might help right now?")
- Connect to support systems ("Who in your life could you reach out to?")
- Remind them feelings are temporary ("This feeling won't last forever")

THINGS TO DO:
- Acknowledge feelings first ("That sounds really tough...")
- Be curious ("What's been going on?")
- Offer small, actionable suggestions ("Have you tried taking a few deep breaths?")
- Normalize experiences ("A lot of students feel this way...")
- Gently encourage self-care or professional help when appropriate
- For severe distress, balance crisis resources with compassionate conversation

THINGS TO AVOID:
- Long paragraphs or walls of text
- Multiple suggestions at once
- Diagnosing or labeling emotions
- Saying "I understand" without showing how
- Generic advice that doesn't connect to what they said
- Being preachy or giving unsolicited advice
- Dismissing or minimizing serious concerns

TOPICS YOU CAN DISCUSS:
- Academic stress and time management
- Relationship concerns
- Homesickness and adjustment
- Anxiety about the future
- Loneliness and social challenges
- Self-esteem and self-worth
- Sleep and wellness habits
- General emotional support
- Crisis support with appropriate resources

Remember: Keep it brief, warm, and human. Less is more. In crisis situations, be more detailed with resources and supportive reframing, but still maintain a warm, conversational tone.`;

const crisisResponse = `I hear you, and I want you to know that what you're feeling matters deeply. I'm really concerned about what you've shared, and I care about your safety and wellbeing.

**Right now, please reach out for immediate support:**

🆘 **National Suicide Prevention Lifeline:** 988 (call or text - available 24/7)
🆘 **Crisis Text Line:** Text HOME to 741741
🆘 **International Association for Suicide Prevention:** https://www.iasp.info/resources/Crisis_Centres/

If you're at a university, your campus counseling center can provide immediate, confidential support.

**I want you to know:**

💚 **You matter.** Your life has value, even if it doesn't feel that way right now. The pain you're feeling is temporary, even though it feels overwhelming.

💚 **You're not alone.** These feelings are more common than you might think, and many people who have felt exactly like you do now have found ways through it. There is hope, even when you can't see it yet.

💚 **Think about the people who care about you** - your family, friends, teachers, or anyone who has shown you kindness. Your presence in their lives matters more than you know. Even if relationships feel strained right now, people care about you.

💚 **This moment is not forever.** Feelings change. Circumstances change. What feels unbearable today can become manageable tomorrow with the right support. You deserve that chance.

💚 **Small steps count.** Right now, just focus on the next five minutes. Then the next hour. You don't have to figure everything out at once. Can you do something small and safe right now - maybe step outside, drink some water, or text someone you trust?

**You've reached out here, which shows incredible strength.** That takes courage. Please take one more brave step and connect with a trained counselor who can give you the support you deserve right now.

Would you like to talk about what's been happening? I'm here to listen, and I won't judge you. Sometimes just talking can help, even a little bit. 💚`;
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

    const lastUserMessage = messages[messages.length - 1]?.content || '';
    
    // Check for crisis - immediate escalation
    if (detectCrisis(lastUserMessage)) {
      console.log("Crisis detected - providing safety resources");
      
      // Return crisis response as a stream-like format
      const responseData = {
        choices: [{
          delta: { content: crisisResponse },
          finish_reason: "stop"
        }],
        detected_mood: "crisis"
      };
      
      return new Response(
        `data: ${JSON.stringify(responseData)}\n\ndata: [DONE]\n\n`,
        {
          headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
        }
      );
    }

    // Detect high distress for softer responses
    const isHighDistress = detectHighDistress(lastUserMessage);
    
    // Prepare messages with system prompt
    const aiMessages = [
      { 
        role: "system", 
        content: systemPrompt + (isHighDistress ? "\n\nIMPORTANT: The user seems to be in distress. Be extra gentle, validate their feelings deeply, and gently suggest professional resources if appropriate." : "")
      },
      ...messages,
    ];

    console.log("Sending request to AI gateway", { messageCount: messages.length, isHighDistress });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: aiMessages,
        stream: true,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Unable to connect to AI service. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Stream the response
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
