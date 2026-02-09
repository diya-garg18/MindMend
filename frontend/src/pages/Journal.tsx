import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Sparkles, Save, RefreshCw, Trash2, Edit2, X, Check, PenLine } from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface JournalEntry {
  id: string;
  prompt: string | null;
  content: string;
  created_at: string;
}

const journalPrompts = [
  "What's one thing you're grateful for today?",
  "Describe a moment from today that made you smile.",
  "What's something you're looking forward to?",
  "Write about a challenge you're facing. What's one small step you could take?",
  "If you could tell your past self one thing, what would it be?",
  "What does self-care look like for you today?",
  "Describe your ideal peaceful moment.",
  "What's a strength you've shown recently that you're proud of?",
  "Write a letter of encouragement to yourself.",
  "What's one thing you learned about yourself this week?",
  "Describe a place where you feel calm and safe.",
  "What boundaries do you need to set or maintain?",
];

export default function Journal() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [freeWriteContent, setFreeWriteContent] = useState('');
  const [promptContent, setPromptContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [activeTab, setActiveTab] = useState('freewrite');

  useEffect(() => {
    getRandomPrompt();
    if (user && token) {
      fetchEntries();
    }
  }, [user, token]);

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * journalPrompts.length);
    setCurrentPrompt(journalPrompts[randomIndex]);
  };

  const fetchEntries = async () => {
    if (!token) return;
    
    try {
      const response = await apiClient.getJournalEntries({}, token);
      if (response.journalEntries) {
        setEntries(response.journalEntries);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleSave = async (isPrompt: boolean) => {
    const content = isPrompt ? promptContent : freeWriteContent;
    if (!content.trim() || !token) return;

    setIsSaving(true);

    try {
      await apiClient.createJournalEntry({
        prompt: isPrompt ? currentPrompt : undefined,
        content: content.trim(),
      }, token);

      toast({
        title: 'Journal entry saved! 📝',
        description: 'Great job taking time to reflect.',
      });

      if (isPrompt) {
        setPromptContent('');
        getRandomPrompt();
      } else {
        setFreeWriteContent('');
      }
      fetchEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: 'Unable to save',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    
    try {
      await apiClient.deleteJournalEntry(id, token);
      toast({ title: 'Entry deleted' });
      fetchEntries();
    } catch (error) {
      toast({
        title: 'Unable to delete',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async (id: string) => {
    if (!token) return;
    
    try {
      const entry = entries.find(e => e.id === id);
      if (!entry) return;

      await apiClient.updateJournalEntry(id, {
        prompt: entry.prompt || undefined,
        content: editContent.trim(),
      }, token);

      toast({ title: 'Entry updated' });
      setEditingId(null);
      fetchEntries();
    } catch (error) {
      toast({
        title: 'Unable to update',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Journal</h1>
        <p className="text-muted-foreground">
          Write about your day, your thoughts, or answer a guided prompt. This is your personal space.
        </p>
      </div>

      {/* Writing Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="freewrite" className="flex items-center gap-2">
            <PenLine className="w-4 h-4" />
            Free Write
          </TabsTrigger>
          <TabsTrigger value="prompt" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Guided Prompt
          </TabsTrigger>
        </TabsList>

        {/* Free Write Tab */}
        <TabsContent value="freewrite">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <PenLine className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-display">Free Write</CardTitle>
                  <CardDescription>Write whatever is on your mind — like a personal diary</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={freeWriteContent}
                onChange={(e) => setFreeWriteContent(e.target.value)}
                placeholder="Dear diary... What happened today? How are you feeling? What's on your mind?"
                className="min-h-[250px] resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {freeWriteContent.length} characters
                </p>
                <Button
                  onClick={() => handleSave(false)}
                  disabled={!freeWriteContent.trim() || isSaving}
                  className="gradient-calm text-primary-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Entry'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prompt Tab */}
        <TabsContent value="prompt">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-display">Today's Prompt</CardTitle>
                    <CardDescription className="mt-1">{currentPrompt}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={getRandomPrompt}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
                placeholder="Start writing your response to the prompt..."
                className="min-h-[200px] resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {promptContent.length} characters
                </p>
                <Button
                  onClick={() => handleSave(true)}
                  disabled={!promptContent.trim() || isSaving}
                  className="gradient-calm text-primary-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Entry'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* All Entries */}
      {entries.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-foreground">Your Entries</h2>
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      {entry.prompt ? (
                        <Sparkles className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div>
                          {entry.prompt && (
                            <p className="text-sm font-medium text-primary mb-1">
                              {entry.prompt}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(entry.created_at), 'EEEE, MMMM d, yyyy • h:mm a')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {editingId === entry.id ? (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleUpdate(entry.id)}
                              >
                                <Check className="w-4 h-4 text-green-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingId(null)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingId(entry.id);
                                  setEditContent(entry.content);
                                }}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(entry.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </div>
                      </div>
                      {editingId === entry.id ? (
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[150px]"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {entry.content}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <Card className="border-0 bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-display font-semibold text-foreground mb-2">💡 Journaling Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• There's no right or wrong way to journal — just write what feels natural</li>
            <li>• Try to write without editing yourself</li>
            <li>• Even a few sentences can be helpful</li>
            <li>• Consider journaling at the same time each day to build a habit</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}