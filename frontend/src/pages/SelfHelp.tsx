import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wind, Eye, Heart, RefreshCw, BookOpen } from 'lucide-react';
import { Music, Play, Pause, Volume2, VolumeX, Flower2, ChevronLeft, ChevronRight, Timer, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
// Audio
import gentleRain from '@/assets/audio/gentle-rain.mp3';
import oceanWaves from '@/assets/audio/ocean-waves.mp3';
import forestBirds from '@/assets/audio/forest-birds.mp3';
import peacefulPiano from '@/assets/audio/peaceful-piano.mp3';
import nightCrickets from '@/assets/audio/night-crickets.mp3';

// Yoga images
import childsPose from '@/assets/yoga/childs-pose.jpg';
import catCow from '@/assets/yoga/cat-cow.jpg';
import legsUpWall from '@/assets/yoga/legs-up-wall.jpg';
import seatedForwardFold from '@/assets/yoga/seated-forward-fold.jpg';
import corpsePose from '@/assets/yoga/corpse-pose.jpg';
import standingForwardBend from '@/assets/yoga/standing-forward-bend.jpg';
import spinalTwist from '@/assets/yoga/spinal-twist.jpg';
import bridgePose from '@/assets/yoga/bridge-pose.jpg';
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
interface Track {
  title: string;
  description: string;
  url: string;
  emoji: string;
}

const tracks: Track[] = [
  {
    title: 'Gentle Rain',
    description: 'Soft rainfall for deep relaxation',
    url: gentleRain,
    emoji: '🌧️',
  },
  {
    title: 'Ocean Waves',
    description: 'Peaceful ocean sounds to calm your mind',
    url: oceanWaves,
    emoji: '🌊',
  },
  {
    title: 'Forest Birds',
    description: 'Birdsong in a tranquil forest',
    url: forestBirds,
    emoji: '🐦',
  },
  {
    title: 'Peaceful Piano',
    description: 'Gentle piano melodies for focus and calm',
    url: peacefulPiano,
    emoji: '🎹',
  },
  {
    title: 'Night Crickets',
    description: 'Evening ambience with crickets chirping',
    url: nightCrickets,
    emoji: '🦗',
  },
];

function CalmingMusic() {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const playTrack = (index: number) => {
    if (currentTrack === index && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(tracks[index].url);
    audio.volume = isMuted ? 0 : volume / 100;
    audio.loop = true;
    audio.preload = 'auto';

    audio.addEventListener('playing', () => {
      setIsPlaying(true);
    });

    audio.addEventListener('pause', () => {
      setIsPlaying(false);
    });

    audio.addEventListener('error', () => {
      setIsPlaying(false);
    });

    audioRef.current = audio;
    setCurrentTrack(index);
    audio.play().catch(() => {
      setIsPlaying(false);
    });
  };

  const handleVolumeChange = (val: number[]) => {
    const v = val[0];
    setVolume(v);
    setIsMuted(v === 0);
    if (audioRef.current) {
      audioRef.current.volume = v / 100;
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioRef.current) {
      audioRef.current.volume = newMuted ? 0 : volume / 100;
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Music className="w-5 h-5 text-primary" />
          Calming Sounds
        </CardTitle>
        <CardDescription>
          Ambient sounds and music to help you relax, focus, or sleep.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Volume control */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Button variant="ghost" size="icon" onClick={toggleMute} className="shrink-0">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-8 text-right">{isMuted ? 0 : volume}%</span>
        </div>

        {/* Track list */}
        <div className="grid gap-3">
          {tracks.map((track, i) => {
            const active = currentTrack === i && isPlaying;
            return (
              <button
                key={i}
                onClick={() => playTrack(i)}
                className={`flex items-center gap-4 p-4 rounded-xl text-left transition-all ${
                  active
                    ? 'bg-primary/10 ring-2 ring-primary/30'
                    : 'bg-muted/30 hover:bg-muted/60'
                }`}
              >
                <span className="text-3xl">{track.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{track.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{track.description}</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          🎧 Tip: Use headphones for the best experience. Sounds loop continuously.
        </p>
      </CardContent>
    </Card>
  );
}

interface Pose {
  name: string;
  sanskrit: string;
  image: string;
  durationLabel: string;
  durationSeconds: number;
  difficulty: 'Beginner' | 'Intermediate';
  benefits: string[];
  instructions: string[];
}

const poses: Pose[] = [
  {
    name: "Child's Pose",
    sanskrit: 'Balasana',
    image: childsPose,
    durationLabel: '1-3 min',
    durationSeconds: 120,
    difficulty: 'Beginner',
    benefits: ['Relieves stress & fatigue', 'Gently stretches hips and back', 'Calms the mind'],
    instructions: [
      'Kneel on the floor with big toes touching',
      'Sit back on your heels',
      'Fold forward, extending arms in front or alongside your body',
      'Rest your forehead on the mat',
      'Breathe deeply and hold',
    ],
  },
  {
    name: 'Cat-Cow Stretch',
    sanskrit: 'Marjaryasana-Bitilasana',
    image: catCow,
    durationLabel: '1-2 min',
    durationSeconds: 90,
    difficulty: 'Beginner',
    benefits: ['Releases spine tension', 'Improves posture', 'Coordinates breath with movement'],
    instructions: [
      'Start on hands and knees (tabletop position)',
      'Inhale: drop belly, lift chest and tailbone (Cow)',
      'Exhale: round spine, tuck chin to chest (Cat)',
      'Flow between the two with each breath',
      'Repeat 8-10 times',
    ],
  },
  {
    name: 'Legs Up the Wall',
    sanskrit: 'Viparita Karani',
    image: legsUpWall,
    durationLabel: '3-5 min',
    durationSeconds: 240,
    difficulty: 'Beginner',
    benefits: ['Reduces anxiety', 'Relieves tired legs', 'Promotes deep relaxation'],
    instructions: [
      'Sit sideways next to a wall',
      'Swing your legs up the wall as you lie back',
      'Scoot your hips as close to the wall as comfortable',
      'Rest arms by your sides, palms up',
      'Close your eyes and breathe naturally',
    ],
  },
  {
    name: 'Seated Forward Fold',
    sanskrit: 'Paschimottanasana',
    image: seatedForwardFold,
    durationLabel: '1-3 min',
    durationSeconds: 120,
    difficulty: 'Beginner',
    benefits: ['Calms the nervous system', 'Stretches hamstrings & spine', 'Reduces headaches'],
    instructions: [
      'Sit with legs extended straight in front',
      'Inhale and lengthen your spine',
      'Exhale and fold forward from hips',
      'Reach for shins, ankles, or feet',
      'Relax your neck and hold',
    ],
  },
  {
    name: 'Corpse Pose',
    sanskrit: 'Savasana',
    image: corpsePose,
    durationLabel: '5-10 min',
    durationSeconds: 300,
    difficulty: 'Beginner',
    benefits: ['Deep relaxation', 'Reduces blood pressure', 'Integrates practice benefits'],
    instructions: [
      'Lie flat on your back',
      'Let feet fall open naturally',
      'Place arms alongside body, palms facing up',
      'Close your eyes',
      'Scan your body and consciously relax each part',
    ],
  },
  {
    name: 'Standing Forward Bend',
    sanskrit: 'Uttanasana',
    image: standingForwardBend,
    durationLabel: '30s-1 min',
    durationSeconds: 60,
    difficulty: 'Beginner',
    benefits: ['Calms the brain', 'Stretches hamstrings and calves', 'Relieves stress'],
    instructions: [
      'Stand with feet hip-width apart',
      'Exhale and fold forward from hips',
      'Let head and arms hang heavy',
      'Bend knees slightly if needed',
      'Hold and breathe deeply',
    ],
  },
  {
    name: 'Supine Spinal Twist',
    sanskrit: 'Supta Matsyendrasana',
    image: spinalTwist,
    durationLabel: '1-2 min per side',
    durationSeconds: 120,
    difficulty: 'Beginner',
    benefits: ['Releases lower back tension', 'Aids digestion', 'Calming and restorative'],
    instructions: [
      'Lie on your back and hug knees to chest',
      'Extend arms out to a T-shape',
      'Drop both knees to the right',
      'Turn your gaze to the left',
      'Hold, then switch sides',
    ],
  },
  {
    name: 'Bridge Pose',
    sanskrit: 'Setu Bandhasana',
    image: bridgePose,
    durationLabel: '30s-1 min',
    durationSeconds: 60,
    difficulty: 'Intermediate',
    benefits: ['Opens chest and heart', 'Reduces anxiety', 'Strengthens back and glutes'],
    instructions: [
      'Lie on your back, bend knees, feet flat on floor',
      'Place arms alongside your body, palms down',
      'Press feet into floor, lift hips toward ceiling',
      'Interlace fingers under your back (optional)',
      'Hold and breathe, then slowly lower down',
    ],
  },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function YogaPoses() {
  const [currentPose, setCurrentPose] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const pose = poses[currentPose];

  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerSeconds(pose.durationSeconds);
  }, [pose.durationSeconds]);

  useEffect(() => {
    setTimerSeconds(pose.durationSeconds);
    setTimerRunning(false);
  }, [currentPose, pose.durationSeconds]);

  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return;
    const id = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerSeconds]);

  const progress = pose.durationSeconds > 0
    ? ((pose.durationSeconds - timerSeconds) / pose.durationSeconds) * 100
    : 0;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Flower2 className="w-5 h-5 text-primary" />
          Calming Yoga Poses
        </CardTitle>
        <CardDescription>
          Gentle poses to release tension and promote relaxation. No experience needed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Pose header with image */}
        <div className="text-center space-y-3">
          <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden bg-muted/30 flex items-center justify-center">
            <img
              src={pose.image}
              alt={`${pose.name} yoga pose demonstration`}
              loading="lazy"
              width={160}
              height={160}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <h3 className="text-xl font-semibold text-foreground">{pose.name}</h3>
          <p className="text-sm text-muted-foreground italic">{pose.sanskrit}</p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-primary">
              <Timer className="w-3.5 h-3.5" /> {pose.durationLabel}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              pose.difficulty === 'Beginner'
                ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                : 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400'
            }`}>
              {pose.difficulty}
            </span>
          </div>
        </div>

        {/* Timer */}
        <div className="p-4 rounded-xl bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Pose Timer</p>
            <span className="text-2xl font-mono font-bold text-primary">{formatTime(timerSeconds)}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTimerRunning(!timerRunning)}
              className="gap-1"
              disabled={timerSeconds === 0}
            >
              {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {timerRunning ? 'Pause' : 'Start'}
            </Button>
            <Button variant="ghost" size="sm" onClick={resetTimer} className="gap-1">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
          </div>
          {timerSeconds === 0 && (
            <p className="text-sm text-center text-primary font-medium">✨ Great job! Pose complete.</p>
          )}
        </div>

        {/* Instructions (above benefits) */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Instructions:</p>
          <ol className="space-y-2">
            {pose.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-semibold">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Benefits */}
        <div className="p-4 rounded-xl bg-primary/5 space-y-2">
          <p className="text-sm font-medium text-foreground">Benefits:</p>
          <ul className="space-y-1">
            {pose.benefits.map((b, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">✦</span> {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPose((p) => (p - 1 + poses.length) % poses.length)}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentPose + 1} / {poses.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPose((p) => (p + 1) % poses.length)}
            className="gap-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          🧘 Tip: Listen to your body. Never push into pain. Modify poses as needed.
        </p>
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
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
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
          <TabsTrigger value="music" className="gap-2">
            <Music className="w-4 h-4" />
            <span className="hidden sm:inline">Music</span>
          </TabsTrigger>
          <TabsTrigger value="yoga" className="gap-2">
            <Flower2 className="w-4 h-4" />
            <span className="hidden sm:inline">Yoga</span>
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
        
        <TabsContent value="music">
          <CalmingMusic />
        </TabsContent>

        <TabsContent value="yoga">
          <YogaPoses />
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
