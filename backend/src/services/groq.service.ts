import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Enhanced crisis keywords for better detection
const crisisKeywords = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die', 'better off dead',
  'self-harm', 'hurt myself', 'cutting', 'overdose', 'no reason to live',
  'not worth living', 'end it all', 'goodbye forever', 'can\'t go on',
  'don\'t want to be here', 'wish i was dead', 'want to disappear',
  'everyone would be better without me', 'give up on life', 'nothing to live for'
];

// High distress keywords for soft support
const distressKeywords = [
  'depressed', 'hopeless', 'worthless', 'alone', 'nobody cares',
  'can\'t go on', 'giving up', 'exhausted', 'overwhelmed', 'panic',
  'anxiety attack', 'breakdown', 'falling apart', 'can\'t cope',
  'hate myself', 'hate my life', 'everything is terrible'
];

function detectCrisis(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
}

function detectHighDistress(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return distressKeywords.some(keyword => lowerMessage.includes(keyword));
}

// System prompt for the mental health chatbot - KEEP ONLY THIS ONE
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

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  content: string;
  detectedMood?: 'crisis' | 'distress' | 'neutral';
}

export async function getChatCompletion(messages: Message[]): Promise<ChatResponse> {
  const lastUserMessage = messages[messages.length - 1]?.content || '';
  
  // Check for crisis - immediate escalation
  if (detectCrisis(lastUserMessage)) {
    console.log('Crisis detected - providing safety resources');
    return {
      content: crisisResponse,
      detectedMood: 'crisis'
    };
  }

  // Detect high distress for softer responses
  const isHighDistress = detectHighDistress(lastUserMessage);
  
  // Prepare messages with system prompt
  const aiMessages: Message[] = [
    { 
      role: 'system', 
      content: systemPrompt + (isHighDistress 
        ? '\n\nIMPORTANT: The user seems to be in distress. Be extra gentle, validate their feelings deeply, and gently suggest professional resources if appropriate.' 
        : '')
    },
    ...messages.filter(m => m.role !== 'system'),
  ];

  console.log('Sending request to Groq', { messageCount: messages.length, isHighDistress });

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: aiMessages,
      temperature: 0.7,
      max_tokens: 800,
      top_p: 1,
      stream: false,
    });

    const content = completion.choices[0]?.message?.content || 'I apologize, but I had trouble responding. Could you try again?';
    
    return {
      content,
      detectedMood: isHighDistress ? 'distress' : 'neutral'
    };
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error('Unable to connect to AI service. Please try again.');
  }
}

export async function generateTitle(messages: Message[]): Promise<string> {
  const conversationSummary = messages
    .filter(m => m.role === 'user')
    .slice(0, 3)
    .map(m => m.content)
    .join(' ');

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Generate a short, concise title (3-5 words) for this conversation. Return only the title, nothing else.'
        },
        {
          role: 'user',
          content: conversationSummary
        }
      ],
      temperature: 0.5,
      max_tokens: 20,
    });

    return completion.choices[0]?.message?.content?.trim() || 'New Conversation';
  } catch (error) {
    console.error('Error generating title:', error);
    return 'New Conversation';
  }
}

export default groq;