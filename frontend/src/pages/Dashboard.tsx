import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/apiClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, BarChart3, Lightbulb, Phone, Calendar, Sparkles, BookOpen, RefreshCw } from 'lucide-react';

interface MoodEntry {
  id: string;
  mood_level: number;
  mood_label: string;
  created_at: string;
}

const moodEmojis: Record<string, string> = {
  'Sad': '😢',
  'Angry': '😠',
  'Happy': '😊',
  'Calm': '😌',
  'Irritated': '😤',
  'Anxious': '😰',
  'Depressed': '😞',
  'Neutral': '😐',
  'Excited': '🤩',
  'Grateful': '🙏',
};

const dailyQuotes = [
  { quote: "You are stronger than you know.", author: "Unknown" },
  { quote: "It's okay to not be okay.", author: "Unknown" },
  { quote: "Progress, not perfection.", author: "Unknown" },
  { quote: "Be gentle with yourself.", author: "Unknown" },
  { quote: "You are worthy of love and belonging.", author: "Brené Brown" },
  { quote: "This too shall pass.", author: "Persian Proverb" },
  { quote: "Your feelings are valid.", author: "Unknown" },
  { quote: "One day at a time.", author: "Unknown" },
  { quote: "You've survived 100% of your worst days.", author: "Unknown" },
  { quote: "Small steps still move you forward.", author: "Unknown" },
  { quote: "You don’t have to have everything figured out today.", author: "Unknown" },
  { quote: "Rest is productive too.", author: "Unknown" },
  { quote: "You are doing the best you can, and that is enough.", author: "Unknown" },
  { quote: "Healing is not linear.", author: "Unknown" },
  { quote: "Your pace is still progress.", author: "Unknown" },
  { quote: "You deserve the same kindness you give to others.", author: "Unknown" },
  { quote: "It’s okay to take things slow.", author: "Unknown" },
  { quote: "Every day is a fresh start.", author: "Unknown" },
  { quote: "You are allowed to grow at your own pace.", author: "Unknown" },
  { quote: "Hard times do not last forever.", author: "Unknown" },
  { quote: "You are not your mistakes.", author: "Unknown" },
  { quote: "Take a deep breath — you’ve got this.", author: "Unknown" },
  { quote: "Even small progress is still progress.", author: "Unknown" },
  { quote: "You are capable of getting through this.", author: "Unknown" },
  { quote: "It’s okay to ask for help.", author: "Unknown" },
  { quote: "Your story is still being written.", author: "Unknown" },
  { quote: "You are more resilient than you think.", author: "Unknown" },
  { quote: "Keep going — you’re closer than you think.", author: "Unknown" },
  { quote: "You matter, even on your hardest days.", author: "Unknown" },
  { quote: "You deserve peace and happiness.", author: "Unknown" },
];

const dailyAffirmations = [
  "I am capable of handling whatever comes my way.",
  "I deserve rest and relaxation.",
  "I am doing my best, and that is enough.",
  "I choose to focus on what I can control.",
  "I am worthy of good things.",
  "I trust myself to make good decisions.",
  "I am allowed to take up space.",
  "I am learning and growing every day.",
  "I am resilient and strong.",
  "I deserve kindness, especially from myself.",
  "I am allowed to move at my own pace.",
  "I am enough just as I am.",
  "I can take things one step at a time.",
  "I am proud of myself for trying.",
  "I deserve peace and calm in my life.",
  "I am stronger than my doubts.",
  "I am in control of my thoughts and actions.",
  "I allow myself to rest without guilt.",
  "I am growing through what I go through.",
  "I deserve support and understanding.",
  "I am allowed to make mistakes and learn from them.",
  "I believe in my ability to improve.",
  "I am not defined by my past.",
  "I am becoming a better version of myself each day.",
  "I choose progress over perfection.",
  "I am worthy of love and respect.",
  "I trust the process of my life.",
  "I can handle challenges with patience and strength.",
  "I deserve to feel safe and supported.",
  "I am doing better than I think I am.",
];

export default function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [dailyQuote, setDailyQuote] = useState(dailyQuotes[0]);
  const [affirmation, setAffirmation] = useState(dailyAffirmations[0]);

  useEffect(() => {
    if (user && token) {
      fetchRecentMoods();
      fetchProfile();
    }
    // Set daily quote and affirmation based on day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setDailyQuote(dailyQuotes[dayOfYear % dailyQuotes.length]);
    setAffirmation(dailyAffirmations[dayOfYear % dailyAffirmations.length]);
  }, [user, token]);

  const fetchProfile = async () => {
    if (!token) return;
    
    try {
      const response = await apiClient.getProfile(token);
      if (response.profile) {
        const name = response.profile.nickname || 
                     response.profile.display_name || 
                     response.profile.username || 
                     user?.email?.split('@')[0] || '';
        setDisplayName(name);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchRecentMoods = async () => {
    if (!token) return;
    
    try {
      const response = await apiClient.getMoodEntries({ limit: '7' }, token);
      if (response.moodEntries) {
        setRecentMoods(response.moodEntries);
        calculateStreak(response.moodEntries);
      }
    } catch (error) {
      console.error('Error fetching moods:', error);
    }
  };

  const calculateStreak = (moods: MoodEntry[]) => {
    if (moods.length === 0) {
      setStreak(0);
      return;
    }
    
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const uniqueDays = new Set<string>();
    moods.forEach(mood => {
      const moodDate = new Date(mood.created_at);
      uniqueDays.add(moodDate.toDateString());
    });
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      if (uniqueDays.has(checkDate.toDateString())) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }
    
    setStreak(currentStreak);
  };

  const refreshAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * dailyAffirmations.length);
    setAffirmation(dailyAffirmations[randomIndex]);
  };

  const quickActions = [
    {
      title: 'Start a Chat',
      description: 'Talk about anything on your mind',
      icon: MessageCircle,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      onClick: () => navigate('/chat'),
    },
    {
      title: 'Log Your Mood',
      description: 'Quick daily check-in',
      icon: BarChart3,
      color: 'text-mood-good',
      bgColor: 'bg-mood-good/10',
      onClick: () => navigate('/mood'),
    },
    {
      title: 'Self-Help Tools',
      description: 'Breathing, grounding & more',
      icon: Lightbulb,
      color: 'text-mood-great',
      bgColor: 'bg-mood-great/10',
      onClick: () => navigate('/self-help'),
    },
    {
      title: 'Resources',
      description: 'Learn about mental health',
      icon: BookOpen,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent',
      onClick: () => navigate('/resources'),
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-foreground">
          Welcome back{displayName ? `, ${displayName}` : ''}! 💚
        </h1>
        <p className="text-muted-foreground">
          How are you feeling today? Take a moment to check in with yourself.
        </p>
      </div>

      {/* Daily Quote & Affirmation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Daily Quote</p>
                <p className="text-foreground font-medium italic">"{dailyQuote.quote}"</p>
                <p className="text-sm text-muted-foreground mt-1">— {dailyQuote.author}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-success/5 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Daily Affirmation</p>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={refreshAffirmation}>
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-foreground font-medium">{affirmation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Check-in Streak</p>
                <p className="text-2xl font-bold text-foreground">
                  {streak} {streak === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entries This Week</p>
                <p className="text-2xl font-bold text-foreground">{recentMoods.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={action.onClick}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Moods */}
      {recentMoods.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold text-foreground">Recent Moods</h2>
            <Button variant="ghost" onClick={() => navigate('/mood')}>
              View All
            </Button>
          </div>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {recentMoods.slice(0, 7).reverse().map((mood) => (
                  <div key={mood.id} className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{moodEmojis[mood.mood_label] || '😐'}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(mood.created_at).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Disclaimer */}
      <Card className="border-0 bg-muted/50">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> MindMend is not a replacement for professional mental health care. 
            If you're experiencing a crisis, please reach out to a mental health professional or call a crisis hotline.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}