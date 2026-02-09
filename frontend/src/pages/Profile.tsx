import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  nickname: string | null;
  display_name: string | null;
  avatar_url: string | null;
  contact_info: string | null;
  location: string | null;
}

export default function ProfilePage() {
  const { user, token, refreshUser } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  
  // Form states
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (user && token) {
      fetchProfile();
    }
  }, [user, token]);

  const fetchProfile = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await apiClient.getProfile(token);
      if (response.profile) {
        setProfile(response.profile);
        setUsername(response.profile.username || '');
        setNickname(response.profile.nickname || '');
        setContactInfo(response.profile.contact_info || '');
        setLocation(response.profile.location || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateUsername = (value: string) => {
    // Username validation rules
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (value.length > 30) return 'Username must be less than 30 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
    return null;
  };

  const handleSave = async () => {
    if (!token) return;

    // Validate username
    const usernameError = validateUsername(username);
    if (usernameError) {
      toast({
        title: 'Invalid username',
        description: usernameError,
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      await apiClient.updateProfile({
        username: username.trim().toLowerCase(),
        nickname: nickname.trim() || undefined,
        contactInfo: contactInfo.trim() || undefined,
        location: location.trim() || undefined,
        displayName: nickname.trim() || username.trim() || undefined,
      }, token);

      toast({
        title: 'Profile updated!',
        description: 'Your changes have been saved.',
      });

      // Refresh user data in auth context
      await refreshUser();
      fetchProfile();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      
      // Check if it's a username conflict error
      if (error.message && error.message.includes('username')) {
        toast({
          title: 'Username taken',
          description: 'This username is already in use. Please choose another.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Unable to save',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information
        </p>
      </div>

      {/* Profile Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-display">Account Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">
              Username <span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_unique_username"
            />
            <p className="text-xs text-muted-foreground">
              Unique identifier for your account (3-30 characters, lowercase, letters, numbers, and underscores only)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname (optional)</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="What should we call you?"
            />
            <p className="text-xs text-muted-foreground">
              This is how we'll greet you in the app
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Information (optional)</Label>
            <Input
              id="contact"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Phone number or alternative contact"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
            />
            <p className="text-xs text-muted-foreground">
              Helps us show relevant crisis resources for your region
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving || !username.trim()}
            className="w-full gradient-calm text-primary-foreground"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Note about password */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-display">Security</CardTitle>
          <CardDescription>Password management</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Password changes are not currently available. If you need to change your password, please contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}