import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wind, Eye, Heart, RefreshCw, BookOpen } from 'lucide-react';

// Breathing Exercise Component
function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [count, setCount] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const startBreathing = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(4);
    
    let currentPhase = 'inhale';
    let currentCount = 4;
    
    const interval = setInterval(() => {
      currentCount--;
      if (currentCount <= 0) {
        if (currentPhase === 'inhale') {
          currentPhase = 'hold';
          currentCount = 7;
        } else if (currentPhase === 'hold') {
          currentPhase = 'exhale';
          currentCount = 8;
        } else {
          currentPhase = 'inhale';
          currentCount = 4;
        }
        setPhase(currentPhase as any);
      }
      setCount(currentCount);
    }, 1000);

    setIntervalId(interval);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsActive(false);
      setPhase('idle');
      setIntervalId(null);
      setTimeoutId(null);
    }, 60000);

    setTimeoutId(timeout);
  };

  const stopBreathing = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsActive(false);
    setPhase('idle');
    setCount(0);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Wind className="w-5 h-5 text-primary" />
          4-7-8 Breathing
        </CardTitle>
        <CardDescription>
          A calming technique to reduce anxiety and promote relaxation.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className={`w-32 h-32 mx-auto rounded-full gradient-calm flex items-center justify-center transition-transform duration-1000 ${
          phase === 'inhale' ? 'scale-125' : phase === 'exhale' ? 'scale-75' : 'scale-100'
        }`}>
          <div className="text-primary-foreground">
            <p className="text-lg font-semibold">
              {phase === 'idle' ? 'Ready' : phase === 'inhale' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out'}
            </p>
            {isActive && <p className="text-3xl font-bold">{count}</p>}
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          {!isActive ? (
            <Button onClick={startBreathing} className="gradient-calm text-primary-foreground">
              Start Exercise
            </Button>
          ) : (
            <Button onClick={stopBreathing} variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
              Stop Exercise
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Grounding 5-4-3-2-1 Component
function GroundingExercise() {
  const [step, setStep] = useState(0);
  
  const steps = [
    { count: 5, sense: 'SEE', prompt: 'Name 5 things you can see around you', icon: '👀' },
    { count: 4, sense: 'TOUCH', prompt: 'Name 4 things you can touch or feel', icon: '✋' },
    { count: 3, sense: 'HEAR', prompt: 'Name 3 things you can hear', icon: '👂' },
    { count: 2, sense: 'SMELL', prompt: 'Name 2 things you can smell', icon: '👃' },
    { count: 1, sense: 'TASTE', prompt: 'Name 1 thing you can taste', icon: '👅' },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Eye className="w-5 h-5 text-primary" />
          5-4-3-2-1 Grounding
        </CardTitle>
        <CardDescription>
          A technique to bring you back to the present moment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 0 ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              This exercise helps when you feel anxious or overwhelmed. 
              Take your time with each step.
            </p>
            <Button onClick={() => setStep(1)} className="gradient-calm text-primary-foreground">
              Begin Grounding
            </Button>
          </div>
        ) : step <= 5 ? (
          <div className="text-center space-y-4">
            <div className="text-6xl">{steps[step - 1].icon}</div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-primary">{steps[step - 1].count}</p>
              <p className="text-xl font-semibold text-foreground">{steps[step - 1].sense}</p>
              <p className="text-muted-foreground">{steps[step - 1].prompt}</p>
            </div>
            <div className="flex gap-2 justify-center">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>Previous</Button>
              )}
              <Button onClick={() => setStep(step + 1)} className="gradient-calm text-primary-foreground">
                {step === 5 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-6xl">🌟</div>
            <h3 className="text-xl font-semibold text-foreground">Great job!</h3>
            <p className="text-muted-foreground">
              You've completed the grounding exercise. Take a moment to notice how you feel.
            </p>
            <Button variant="outline" onClick={() => setStep(0)}>
              Start Over
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Affirmations Component
function Affirmations() {
  const affirmations = [
    "I am worthy of love and respect.",
    "I am doing my best, and that is enough.",
    "I have the strength to overcome challenges.",
    "I am allowed to take breaks and rest.",
    "My feelings are valid and important.",
    "I am growing and learning every day.",
    "I deserve happiness and peace.",
    "I am capable of achieving my goals.",
    "It's okay to ask for help when I need it.",
    "I am more than my mistakes.",
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextAffirmation = () => {
    setCurrentIndex((prev) => (prev + 1) % affirmations.length);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Heart className="w-5 h-5 text-primary" />
          Daily Affirmations
        </CardTitle>
        <CardDescription>
          Positive statements to boost your confidence and mood.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="p-8 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
          <p className="text-xl md:text-2xl font-display font-medium text-foreground leading-relaxed">
            "{affirmations[currentIndex]}"
          </p>
        </div>
        <Button onClick={nextAffirmation} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Next Affirmation
        </Button>
      </CardContent>
    </Card>
  );
}

// Thought Reframing Component
function ThoughtReframing() {
  const [step, setStep] = useState(0);
  const [negativeThought, setNegativeThought] = useState('');
  const [reframedThought, setReframedThought] = useState('');

  const examples = [
    { negative: "I'm going to fail this exam.", reframed: "I've prepared as much as I can. Whatever happens, I can learn from it." },
    { negative: "Nobody likes me.", reframed: "Some people appreciate me, and I'm working on building meaningful connections." },
    { negative: "I can't do anything right.", reframed: "I make mistakes sometimes, but I also have many successes." },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <RefreshCw className="w-5 h-5 text-primary" />
          Thought Reframing
        </CardTitle>
        <CardDescription>
          Challenge negative thoughts and find balanced perspectives.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">How it works:</h4>
          <ol className="space-y-2 text-muted-foreground">
            <li>1. Notice a negative thought</li>
            <li>2. Ask: Is this 100% true?</li>
            <li>3. Find a more balanced way to think about it</li>
          </ol>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Examples:</h4>
          {examples.map((example, i) => (
            <div key={i} className="p-4 rounded-lg bg-muted/50 space-y-2">
              <p className="text-sm">
                <span className="text-destructive font-medium">❌ </span>
                {example.negative}
              </p>
              <p className="text-sm">
                <span className="text-success font-medium">✓ </span>
                {example.reframed}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SelfHelp() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Self-Help Tools</h1>
        <p className="text-muted-foreground">
          Simple, effective tools to help you feel calmer and more grounded.
        </p>
      </div>

      <Tabs defaultValue="breathing" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="breathing" className="gap-2">
            <Wind className="w-4 h-4" />
            <span className="hidden sm:inline">Breathing</span>
          </TabsTrigger>
          <TabsTrigger value="grounding" className="gap-2">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Grounding</span>
          </TabsTrigger>
          <TabsTrigger value="affirmations" className="gap-2">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Affirmations</span>
          </TabsTrigger>
          <TabsTrigger value="reframing" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Reframing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="breathing">
          <BreathingExercise />
        </TabsContent>

        <TabsContent value="grounding">
          <GroundingExercise />
        </TabsContent>

        <TabsContent value="affirmations">
          <Affirmations />
        </TabsContent>

        <TabsContent value="reframing">
          <ThoughtReframing />
        </TabsContent>
      </Tabs>

      {/* Tips Card */}
      <Card className="border-0 bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-display font-semibold text-foreground mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Tips for Using These Tools
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Practice regularly, even when you're feeling okay</li>
            <li>• Find a quiet, comfortable space when possible</li>
            <li>• Be patient with yourself — these skills take practice</li>
            <li>• Combine different tools based on what works for you</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
