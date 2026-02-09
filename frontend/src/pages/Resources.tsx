import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Brain, Moon, Heart, BookOpen, Zap, Coffee, Users, GraduationCap } from 'lucide-react';

const resourceSections = [
  {
    id: 'stress-anxiety',
    icon: Zap,
    title: 'Stress & Anxiety',
    description: 'Understanding and managing stress',
    content: [
      {
        question: 'What is stress?',
        answer: 'Stress is your body\'s natural response to challenges or demands. It\'s completely normal to feel stressed sometimes. Short-term stress can actually help you focus and perform, but long-term stress can affect your health and wellbeing.'
      },
      {
        question: 'What is anxiety?',
        answer: 'Anxiety is a feeling of worry, nervousness, or unease about something. Everyone feels anxious sometimes — before exams, presentations, or new situations. It becomes a concern when it\'s constant and interferes with daily life.'
      },
      {
        question: 'Simple ways to reduce stress',
        answer: '• Take slow, deep breaths\n• Go for a short walk\n• Talk to someone you trust\n• Break big tasks into smaller ones\n• Take regular breaks from studying\n• Listen to calming music\n• Limit caffeine and get enough sleep'
      },
      {
        question: 'When to seek help',
        answer: 'Consider talking to a professional if anxiety is constant, affects your sleep or eating, makes it hard to concentrate, or causes physical symptoms like racing heart or trembling.'
      }
    ]
  },
  {
    id: 'depression',
    icon: Heart,
    title: 'Depression Basics',
    description: 'What it is and how to cope',
    content: [
      {
        question: 'What is depression?',
        answer: 'Depression is more than just feeling sad. It\'s a persistent feeling of sadness, emptiness, or hopelessness that lasts for weeks and affects your daily life. It\'s a real health condition — not a sign of weakness.'
      },
      {
        question: 'Common signs',
        answer: '• Feeling sad or empty most of the time\n• Loss of interest in things you used to enjoy\n• Changes in sleep or appetite\n• Difficulty concentrating\n• Feeling tired all the time\n• Feeling worthless or guilty\n• Thoughts of self-harm (if this is you, please reach out for help)'
      },
      {
        question: 'Small steps that can help',
        answer: '• Keep a routine, even a simple one\n• Move your body, even just a short walk\n• Connect with others, even briefly\n• Be kind to yourself\n• Do one small thing each day that brings you joy\n• Avoid alcohol and drugs'
      },
      {
        question: 'Getting support',
        answer: 'Depression is treatable. Talk to a counselor, doctor, or mental health professional. You don\'t have to face this alone. Many students go through this, and help is available.'
      }
    ]
  },
  {
    id: 'academic-pressure',
    icon: GraduationCap,
    title: 'Academic & Exam Pressure',
    description: 'Managing school stress',
    content: [
      {
        question: 'Why does studying feel so stressful?',
        answer: 'Academic pressure comes from many sources — grades, expectations, competition, future career worries. It\'s normal to feel overwhelmed, especially during exam periods. Remember: your worth is not defined by your grades.'
      },
      {
        question: 'Study tips that actually work',
        answer: '• Study in short focused sessions (25-30 minutes)\n• Take regular breaks\n• Review notes soon after class\n• Explain concepts to someone else\n• Get enough sleep — your brain needs it to remember\n• Don\'t cram — spread study over several days'
      },
      {
        question: 'Dealing with exam anxiety',
        answer: '• Prepare well in advance\n• Practice with past papers\n• On exam day, arrive early and stay calm\n• Read questions carefully\n• If you blank out, take deep breaths and move to another question\n• Remember: one exam does not define your future'
      },
      {
        question: 'Perfectionism',
        answer: 'Trying to be perfect often leads to more stress, not better results. Aim for "good enough" sometimes. Making mistakes is part of learning. Focus on progress, not perfection.'
      }
    ]
  },
  {
    id: 'sleep',
    icon: Moon,
    title: 'Sleep & Mental Health',
    description: 'Why sleep matters',
    content: [
      {
        question: 'Why is sleep so important?',
        answer: 'Sleep is when your brain processes what you\'ve learned, repairs itself, and prepares for the next day. Poor sleep affects mood, concentration, memory, and overall health. Most young adults need 7-9 hours.'
      },
      {
        question: 'Tips for better sleep',
        answer: '• Keep a consistent sleep schedule\n• Avoid screens 1 hour before bed\n• Make your room dark and cool\n• Limit caffeine after 2pm\n• Don\'t study in bed\n• Wind down with relaxing activities before sleep'
      },
      {
        question: 'Sleep and mood',
        answer: 'Poor sleep can worsen anxiety and depression. If you\'re struggling with your mental health, improving sleep is often one of the most helpful changes you can make.'
      },
      {
        question: 'Can\'t fall asleep?',
        answer: 'If you can\'t sleep after 20 minutes, get up and do something calming (like reading) until you feel sleepy. Try not to watch the clock. Practice relaxation techniques or breathing exercises.'
      }
    ]
  },
  {
    id: 'self-care',
    icon: Coffee,
    title: 'Self-Care Habits',
    description: 'Taking care of yourself',
    content: [
      {
        question: 'What is self-care?',
        answer: 'Self-care means taking time to look after your physical, mental, and emotional health. It\'s not selfish — it\'s necessary. Small daily habits add up to big differences in how you feel.'
      },
      {
        question: 'Simple self-care ideas',
        answer: '• Drink enough water\n• Eat regular, balanced meals\n• Move your body daily\n• Spend time outdoors\n• Connect with friends or family\n• Do something you enjoy\n• Set boundaries and say no sometimes\n• Take breaks from social media'
      },
      {
        question: 'Self-care when you\'re busy',
        answer: 'Even 5 minutes counts. Take a few deep breaths between classes. Eat lunch away from your desk. Listen to music you love. Send a quick message to a friend. These small moments matter.'
      },
      {
        question: 'Self-care isn\'t always easy',
        answer: 'Sometimes self-care means doing the hard things — having a difficult conversation, asking for help, setting boundaries. It\'s about what\'s good for you in the long run, not just what feels good right now.'
      }
    ]
  },
  {
    id: 'relationships',
    icon: Users,
    title: 'Relationships & Loneliness',
    description: 'Connecting with others',
    content: [
      {
        question: 'Feeling lonely at college?',
        answer: 'Loneliness is incredibly common among students, even those who seem popular. It takes time to build meaningful connections. Be patient with yourself and keep putting yourself out there.'
      },
      {
        question: 'Making friends',
        answer: '• Join clubs or groups related to your interests\n• Say yes to social invitations\n• Start small — a smile or "hello" counts\n• Be a good listener\n• Stay in touch with old friends too\n• Quality matters more than quantity'
      },
      {
        question: 'Healthy relationships',
        answer: 'Healthy relationships (friendships and romantic) involve mutual respect, trust, good communication, and support. You should feel safe, valued, and able to be yourself.'
      },
      {
        question: 'Dealing with conflict',
        answer: 'Disagreements are normal. Try to communicate calmly, listen to understand (not just to respond), and look for solutions together. It\'s okay to take a break and cool down before discussing difficult topics.'
      }
    ]
  }
];

export default function Resources() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Mental Health Resources</h1>
        <p className="text-muted-foreground">
          Simple, clear information about mental health topics. No medical jargon, just helpful guidance.
        </p>
      </div>

      {/* Quick note */}
      <Card className="border-0 bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <p className="text-sm text-foreground">
            <Brain className="w-4 h-4 inline mr-2 text-primary" />
            <strong>Remember:</strong> This information is for education only. It's not a replacement for professional advice. 
            If you're struggling, please talk to a counselor or doctor.
          </p>
        </CardContent>
      </Card>

      {/* Resource Sections */}
      <div className="grid gap-6">
        {resourceSections.map((section) => (
          <Card key={section.id} className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-display">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                {section.title}
              </CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {section.content.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground whitespace-pre-line">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer note */}
      <Card className="border-0 bg-muted/50">
        <CardContent className="p-6 text-center">
          <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Want to learn more? Your campus counseling center and library have additional resources.
            Don't hesitate to reach out to a professional if you need support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
