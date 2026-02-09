import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, ExternalLink, Heart, AlertTriangle, Users, GraduationCap, Globe, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CrisisResource {
  name: string;
  description: string;
  phone: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  primary: boolean;
}

interface CountryResources {
  emergency: string;
  resources: CrisisResource[];
}

const crisisResourcesByCountry: Record<string, CountryResources> = {
  US: {
    emergency: '911',
    resources: [
      {
        name: '988 Suicide & Crisis Lifeline',
        description: 'Free, 24/7 support for people in distress. Call or text 988.',
        phone: '988',
        url: 'https://988lifeline.org',
        icon: Phone,
        primary: true,
      },
      {
        name: 'Crisis Text Line',
        description: 'Text HOME to 741741 to connect with a trained crisis counselor.',
        phone: '741741',
        url: 'https://www.crisistextline.org',
        icon: Phone,
        primary: true,
      },
      {
        name: 'SAMHSA National Helpline',
        description: 'Treatment referrals and information. 1-800-662-4357.',
        phone: '1-800-662-4357',
        url: 'https://www.samhsa.gov/find-help/national-helpline',
        icon: Users,
        primary: false,
      },
      {
        name: 'The Trevor Project',
        description: 'Crisis support for LGBTQ+ young people. 1-866-488-7386.',
        phone: '1-866-488-7386',
        url: 'https://www.thetrevorproject.org',
        icon: Heart,
        primary: false,
      },
    ],
  },
  IN: {
    emergency: '112',
    resources: [
      {
        name: 'iCall',
        description: 'Psychosocial helpline by TISS. Mon-Sat 8am-10pm. 9152987821',
        phone: '9152987821',
        url: 'https://icallhelpline.org',
        icon: Phone,
        primary: true,
      },
      {
        name: 'Vandrevala Foundation',
        description: '24/7 mental health support helpline. 1860-2662-345',
        phone: '1860-2662-345',
        url: 'https://www.vandrevalafoundation.com',
        icon: Phone,
        primary: true,
      },
      {
        name: 'NIMHANS',
        description: 'National Institute of Mental Health and Neurosciences. 080-46110007',
        phone: '080-46110007',
        url: 'https://nimhans.ac.in',
        icon: Users,
        primary: false,
      },
      {
        name: 'Snehi',
        description: 'Emotional support helpline. 044-24640050 (2pm-10pm)',
        phone: '044-24640050',
        url: 'https://snehiindia.org',
        icon: Heart,
        primary: false,
      },
      {
        name: 'AASRA',
        description: '24/7 crisis intervention. 91-22-27546669',
        phone: '91-22-27546669',
        url: 'http://www.aasra.info',
        icon: Heart,
        primary: false,
      },
    ],
  },
  UK: {
    emergency: '999',
    resources: [
      {
        name: 'Samaritans',
        description: '24/7 emotional support. Call 116 123 (free)',
        phone: '116 123',
        url: 'https://www.samaritans.org',
        icon: Phone,
        primary: true,
      },
      {
        name: 'Mind',
        description: 'Mental health charity. 0300 123 3393',
        phone: '0300 123 3393',
        url: 'https://www.mind.org.uk',
        icon: Phone,
        primary: true,
      },
      {
        name: 'CALM',
        description: 'Campaign Against Living Miserably. 0800 58 58 58 (5pm-midnight)',
        phone: '0800 58 58 58',
        url: 'https://www.thecalmzone.net',
        icon: Users,
        primary: false,
      },
      {
        name: 'Papyrus HOPELINEUK',
        description: 'For young people under 35. 0800 068 41 41',
        phone: '0800 068 41 41',
        url: 'https://www.papyrus-uk.org',
        icon: Heart,
        primary: false,
      },
    ],
  },
  AU: {
    emergency: '000',
    resources: [
      {
        name: 'Lifeline Australia',
        description: '24/7 crisis support. 13 11 14',
        phone: '13 11 14',
        url: 'https://www.lifeline.org.au',
        icon: Phone,
        primary: true,
      },
      {
        name: 'Beyond Blue',
        description: 'Anxiety and depression support. 1300 22 4636',
        phone: '1300 22 4636',
        url: 'https://www.beyondblue.org.au',
        icon: Phone,
        primary: true,
      },
      {
        name: 'Kids Helpline',
        description: 'For young people 5-25. 1800 55 1800',
        phone: '1800 55 1800',
        url: 'https://kidshelpline.com.au',
        icon: Heart,
        primary: false,
      },
    ],
  },
  CA: {
    emergency: '911',
    resources: [
      {
        name: 'Crisis Services Canada',
        description: '24/7 suicide prevention. 1-833-456-4566',
        phone: '1-833-456-4566',
        url: 'https://www.crisisservicescanada.ca',
        icon: Phone,
        primary: true,
      },
      {
        name: 'Kids Help Phone',
        description: 'For young people. 1-800-668-6868',
        phone: '1-800-668-6868',
        url: 'https://kidshelpphone.ca',
        icon: Phone,
        primary: true,
      },
    ],
  },
};

const countryNames: Record<string, string> = {
  US: 'United States',
  IN: 'India',
  UK: 'United Kingdom',
  AU: 'Australia',
  CA: 'Canada',
};

const selfCareReminders = [
  "It's okay to not be okay. Seeking help is a sign of strength.",
  "Your feelings are valid, even if others don't understand them.",
  "Recovery isn't linear — bad days don't erase your progress.",
  "You are not alone. Many people struggle with mental health.",
  "Taking a break is not giving up. Rest is necessary.",
];

export default function Crisis() {
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);

  useEffect(() => {
    // Try to detect user's location
    detectLocation();
  }, []);

  const detectLocation = async () => {
    try {
      // Using a free geolocation API
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const countryCode = data.country_code;
      
      if (crisisResourcesByCountry[countryCode]) {
        setSelectedCountry(countryCode);
        setDetectedCountry(countryCode);
      }
    } catch (error) {
      console.log('Could not detect location, defaulting to US');
    }
  };

  const currentResources = crisisResourcesByCountry[selectedCountry] || crisisResourcesByCountry.US;

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const callNumber = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Warning Banner */}
      <Card className="border-2 border-destructive/50 bg-destructive/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-foreground mb-2">
                If You're in Immediate Danger
              </h2>
              <p className="text-foreground mb-4">
                If you or someone you know is in immediate danger, please call <strong>{currentResources.emergency}</strong> or go to your nearest emergency room.
              </p>
              <Button
                onClick={() => callNumber(currentResources.emergency)}
                variant="destructive"
                className="font-semibold"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call {currentResources.emergency}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Selection */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Your location:</span>
            </div>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(countryNames).map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name} {detectedCountry === code && '(detected)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Crisis Resources</h1>
        <p className="text-muted-foreground">
          Professional help is available 24/7 in {countryNames[selectedCountry]}. You don't have to face this alone.
        </p>
      </div>

      {/* Primary Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentResources.resources.filter(r => r.primary).map((resource) => (
          <Card key={resource.name} className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-calm flex items-center justify-center">
                  <resource.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg font-display">{resource.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>{resource.description}</CardDescription>
              <div className="flex gap-2">
                <Button
                  onClick={() => callNumber(resource.phone)}
                  className="flex-1 gradient-calm text-primary-foreground"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call {resource.phone}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openLink(resource.url)}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-foreground">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentResources.resources.filter(r => !r.primary).map((resource) => (
            <Card key={resource.name} className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <resource.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">{resource.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => callNumber(resource.phone)}
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openLink(resource.url)}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Website
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* International Resources */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Globe className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg font-display">International Resources</CardTitle>
              <CardDescription>Crisis centers around the world</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => openLink('https://www.iasp.info/resources/Crisis_Centres/')}
          >
            <Globe className="w-4 h-4 mr-2" />
            Find Crisis Centers Worldwide
          </Button>
        </CardContent>
      </Card>

      {/* Campus Resources */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg font-display">Campus Resources</CardTitle>
              <CardDescription>Your university likely has these services available</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong>Counseling Center:</strong> Most campuses offer free counseling sessions for students</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong>Health Services:</strong> Campus health centers can help with mental health referrals</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong>Dean of Students:</strong> Can help coordinate academic accommodations during difficult times</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong>Resident Advisors:</strong> If you live on campus, RAs are trained to help</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Encouragement */}
      <Card className="border-0 bg-secondary/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-5 h-5 text-mood-good" />
            <h3 className="font-display font-semibold text-foreground">Remember</h3>
          </div>
          <ul className="space-y-2">
            {selfCareReminders.map((reminder, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary shrink-0">💚</span>
                {reminder}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-0 bg-muted/50">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> MindMend is an AI companion and is not a substitute for professional mental health care. 
            If you're struggling, please reach out to a qualified mental health professional or one of the crisis resources above.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
