import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuestMode } from '@/hooks/useGuestMode';
import { useGuestLocation, getEmergencyContacts } from '@/hooks/useGuestLocation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2, Brain, User, LogIn, AlertTriangle, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

// Crisis keywords for guest safety
const crisisKeywords = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
  'self-harm', 'hurt myself', 'cutting', 'overdose', 'no reason to live'
];

const distressKeywords = [
  'depressed', 'hopeless', 'worthless', 'alone', 'nobody cares',
  'can\'t go on', 'giving up', 'overwhelmed', 'panic', 'anxiety attack'
];

function detectCrisis(message: string): boolean {
  const lower = message.toLowerCase();
  return crisisKeywords.some(keyword => lower.includes(keyword));
}

function detectDistress(message: string): boolean {
  const lower = message.toLowerCase();
  return distressKeywords.some(keyword => lower.includes(keyword));
}

export default function GuestChat() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { guestMessages, addGuestMessage } = useGuestMode();
  const { location } = useGuestLocation();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get location-specific emergency contacts
  const emergencyContacts = getEmergencyContacts(location.countryCode);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [guestMessages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Check for crisis - provide location-specific resources
    if (detectCrisis(userMessage)) {
      addGuestMessage('user', userMessage);
      setShowCrisisAlert(true);
      
      // Build location-specific crisis message
      const contactsList = emergencyContacts.map(c => `🆘 **${c.name}:** ${c.number} (${c.description})`).join('\n');
      
      addGuestMessage('assistant', `I hear you, and I'm really concerned about what you've shared. Your feelings matter, and there are people who want to help.

**Please reach out right now (${location.country}):**
${contactsList}

You don't have to face this alone. Would you like to talk more, or can I help you find local resources?`);
      return;
    }

    addGuestMessage('user', userMessage);
    setIsLoading(true);

    try {
      // Check for distress
      const isDistressed = detectDistress(userMessage);

      const apiMessages = guestMessages
        .map(m => ({ role: m.role, content: m.content }))
        .concat({ role: 'user' as const, content: userMessage });

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages, isGuest: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
            }
          } catch {
            // Incomplete JSON
          }
        }
      }

      if (assistantContent) {
        addGuestMessage('assistant', assistantContent);
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Unable to send message',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between bg-background">
        <div>
          <h1 className="text-xl font-display font-semibold text-foreground">Guest Chat</h1>
          <p className="text-sm text-muted-foreground">Chat without an account (session only)</p>
        </div>
        <Button onClick={() => navigate('/auth')} variant="outline" size="sm">
          <LogIn className="w-4 h-4 mr-2" />
          Sign Up to Save
        </Button>
      </div>

      {/* Crisis Alert Banner - Location Aware */}
      {showCrisisAlert && (
        <div className="bg-destructive/10 border-b border-destructive/20 p-3 flex items-center justify-center gap-2 flex-wrap">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <span className="text-sm text-foreground">
            <MapPin className="w-3 h-3 inline mr-1" />
            {location.country}: Call <strong>{emergencyContacts[0]?.number || '988'}</strong> ({emergencyContacts[0]?.name || 'Crisis Line'})
          </span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {guestMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl gradient-calm flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-lg font-display font-semibold text-foreground">
                Hi there! 💚
              </h2>
              <p className="text-muted-foreground">
                Welcome to MindMend. I'm here to listen and support you. 
                Feel free to share what's on your mind.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Note: As a guest, your chat is only saved for this session.
                Create an account to save your conversations.
              </p>
            </div>
          </div>
        ) : (
          guestMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3 animate-fade-in',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg gradient-calm flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <Card
                className={cn(
                  'max-w-[80%] p-4 shadow-sm',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground border-0'
                    : 'bg-card border-border'
                )}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </Card>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3 justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-lg gradient-calm flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <Card className="p-4 bg-card border-border">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-typing" />
                <span className="w-2 h-2 bg-primary rounded-full animate-typing" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-typing" style={{ animationDelay: '0.4s' }} />
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4 bg-background">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[52px] max-h-32 resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="gradient-calm text-primary-foreground px-4"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
