import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useGuestMode } from '@/hooks/useGuestMode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, MessageCircle, BarChart3, Lightbulb, Shield, Heart, ArrowRight, Sparkles, Users } from 'lucide-react';
import { useEffect } from 'react';

const features = [
  {
    icon: MessageCircle,
    title: 'Supportive Conversations',
    description: 'Talk freely about anything on your mind with an empathetic AI companion.',
  },
  {
    icon: BarChart3,
    title: 'Mood Tracking',
    description: 'Track your emotional patterns and gain insights into your wellbeing.',
  },
  {
    icon: Lightbulb,
    title: 'Self-Help Tools',
    description: 'Breathing exercises, grounding techniques, and thought reframing.',
  },
  {
    icon: Shield,
    title: 'Crisis Resources',
    description: 'Immediate access to professional help when you need it most.',
  },
];

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { setIsGuest } = useGuestMode();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleGuestAccess = () => {
    setIsGuest(true);
    navigate('/guest-chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl gradient-calm flex items-center justify-center shadow-xl">
                <Brain className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Heart className="w-6 h-6 text-mood-good fill-current animate-pulse" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground">
              MindMend
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Your mental wellness companion, designed for students. 
              Talk, reflect, and find calm — anytime, anywhere.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="gradient-calm text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth')}
              className="px-8 py-6 text-lg"
            >
              Sign In
            </Button>
          </div>

          {/* Guest Access */}
          <div className="pt-4">
            <Button
              variant="ghost"
              onClick={handleGuestAccess}
              className="text-muted-foreground hover:text-foreground"
            >
              <Users className="w-4 h-4 mr-2" />
              Continue as Guest
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Try the chat without signing up (session only)
            </p>
          </div>

          {/* Trust indicators */}
          <p className="text-sm text-muted-foreground">
            Free to use • Your privacy is protected • Not a replacement for professional care
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-12">
            Everything you need to support your mental wellness
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="container mx-auto px-4 py-16 bg-secondary/30">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            How MindMend Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full gradient-calm text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="font-semibold text-foreground">Create an Account</h3>
              <p className="text-sm text-muted-foreground">
                Quick sign-up to save your progress and conversations.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full gradient-calm text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="font-semibold text-foreground">Start a Conversation</h3>
              <p className="text-sm text-muted-foreground">
                Talk about anything — stress, relationships, or just how you're feeling.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full gradient-calm text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="font-semibold text-foreground">Track Your Wellness</h3>
              <p className="text-sm text-muted-foreground">
                Log moods, try exercises, and see your patterns over time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Footer */}
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto border-0 bg-muted/50">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> MindMend is an AI companion designed to provide emotional support and wellness tools. 
              It is <strong>not</strong> a replacement for professional mental health care, therapy, or medical advice. 
              If you're experiencing a mental health emergency, please contact a crisis hotline or emergency services immediately.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-foreground">MindMend</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your mental wellness companion 💚
          </p>
        </div>
      </footer>
    </div>
  );
}
