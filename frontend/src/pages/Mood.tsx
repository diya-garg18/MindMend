import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Edit2, X, Check } from 'lucide-react';
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

interface MoodEntry {
  id: string;
  mood_level: number;
  mood_label: string;
  notes: string | null;
  created_at: string;
}

const moodOptions = [
  { level: 1, label: 'Sad', emoji: '😢', color: '#6B7280' },
  { level: 2, label: 'Angry', emoji: '😠', color: '#EF4444' },
  { level: 3, label: 'Happy', emoji: '😊', color: '#10B981' },
  { level: 4, label: 'Calm', emoji: '😌', color: '#3B82F6' },
  { level: 5, label: 'Irritated', emoji: '😒', color: '#F59E0B' },
  { level: 6, label: 'Anxious', emoji: '😰', color: '#8B5CF6' },
  { level: 7, label: 'Depressed', emoji: '😞', color: '#374151' },
  { level: 8, label: 'Neutral', emoji: '😐', color: '#9CA3AF' },
  { level: 9, label: 'Excited', emoji: '🤩', color: '#EC4899' },
  { level: 10, label: 'Grateful', emoji: '🙏', color: '#14B8A6' },
];

export default function Mood() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allMoods, setAllMoods] = useState<MoodEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    if (user && token) {
      fetchAllMoods();
    }
  }, [user, token]);

  const fetchAllMoods = async () => {
    if (!token) return;
    
    try {
      const response = await apiClient.getMoodEntries({}, token);
      if (response.moodEntries) {
        setAllMoods(response.moodEntries);
      }
    } catch (error) {
      console.error('Error fetching moods:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood || !token) return;

    setIsSubmitting(true);

    try {
      const moodLabel = moodOptions.find(m => m.level === selectedMood)?.label || '';

      await apiClient.createMoodEntry({
        moodLevel: selectedMood,
        moodLabel: moodLabel,
        notes: notes.trim() || undefined,
      }, token);

      toast({
        title: 'Mood logged!',
        description: 'Great job checking in with yourself today. 💚',
      });

      setSelectedMood(null);
      setNotes('');
      fetchAllMoods();
    } catch (error) {
      console.error('Error saving mood:', error);
      toast({
        title: 'Unable to save mood',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    
    try {
      await apiClient.deleteMoodEntry(id, token);
      toast({ title: 'Entry deleted' });
      fetchAllMoods();
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
      const entry = allMoods.find(m => m.id === id);
      if (!entry) return;

      await apiClient.updateMoodEntry(id, {
        moodLevel: entry.mood_level,
        moodLabel: entry.mood_label,
        notes: editNotes.trim() || undefined,
      }, token);

      toast({ title: 'Entry updated' });
      setEditingId(null);
      fetchAllMoods();
    } catch (error) {
      toast({
        title: 'Unable to update',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Calculate mood percentages for different time periods
  const calculateMoodStats = (entries: MoodEntry[]) => {
    const moodCounts: Record<string, number> = {};
    entries.forEach(entry => {
      moodCounts[entry.mood_label] = (moodCounts[entry.mood_label] || 0) + 1;
    });

    const total = entries.length;
    return Object.entries(moodCounts).map(([label, count]) => ({
      name: label,
      value: count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: moodOptions.find(m => m.label === label)?.color || '#9CA3AF',
    }));
  };

  const today = new Date();
  const todayMoods = allMoods.filter(m => {
    const date = new Date(m.created_at);
    return date >= startOfDay(today) && date <= endOfDay(today);
  });

  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weeklyMoods = allMoods.filter(m => {
    const date = new Date(m.created_at);
    return date >= weekStart && date <= weekEnd;
  });

  const dailyStats = calculateMoodStats(todayMoods);
  const weeklyStats = calculateMoodStats(weeklyMoods);
  const allTimeStats = calculateMoodStats(allMoods);

  const renderPieChart = (data: { name: string; value: number; percentage: number; color: string }[], title: string) => (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-display">{title}</CardTitle>
        <CardDescription>
          {data.length === 0 ? 'No entries yet' : `${data.reduce((sum, d) => sum + d.value, 0)} total entries`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No mood data for this period
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-muted-foreground text-sm">
                            {data.value} entries ({data.percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Mood Check-In</h1>
        <p className="text-muted-foreground">
          How are you feeling right now? You can log multiple moods throughout the day.
        </p>
      </div>

      {/* Mood Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-display">Log Your Mood</CardTitle>
          <CardDescription>
            Select how you're feeling right now. You can log as many times as you'd like each day.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.level}
                onClick={() => setSelectedMood(mood.level)}
                className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                  selectedMood === mood.level
                    ? 'ring-2 ring-primary scale-105 shadow-lg'
                    : 'bg-muted hover:bg-muted/80'
                }`}
                style={{
                  backgroundColor: selectedMood === mood.level ? mood.color : undefined,
                  color: selectedMood === mood.level ? 'white' : undefined,
                }}
              >
                <span className="text-2xl mb-1">{mood.emoji}</span>
                <span className="text-sm font-medium">{mood.label}</span>
              </button>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Notes (optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What's on your mind? Any context about how you're feeling..."
              className="min-h-[100px]"
            />
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedMood || isSubmitting}
            className="w-full gradient-calm text-primary-foreground"
          >
            {isSubmitting ? 'Saving...' : 'Log Mood'}
          </Button>
        </CardContent>
      </Card>

      {/* Mood Statistics */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-foreground">Mood Statistics</h2>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Today</TabsTrigger>
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="alltime">All Time</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="mt-4">
            {renderPieChart(dailyStats, "Today's Moods")}
          </TabsContent>
          <TabsContent value="weekly" className="mt-4">
            {renderPieChart(weeklyStats, "This Week's Moods")}
          </TabsContent>
          <TabsContent value="alltime" className="mt-4">
            {renderPieChart(allTimeStats, "All Time Moods")}
          </TabsContent>
        </Tabs>
      </div>

      {/* Recent Entries */}
      {allMoods.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-display">Recent Entries</CardTitle>
            <CardDescription>Your mood check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allMoods.slice(0, 20).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <span className="text-2xl">
                    {moodOptions.find(m => m.label === entry.mood_label)?.emoji || '😐'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-foreground">{entry.mood_label}</p>
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
                                setEditNotes(entry.notes || '');
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
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(entry.created_at), 'EEEE, MMMM d, yyyy • h:mm a')}
                    </p>
                    {editingId === entry.id ? (
                      <Textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="mt-2"
                        placeholder="Add notes..."
                      />
                    ) : entry.notes && (
                      <p className="text-sm text-muted-foreground mt-1 italic">
                        "{entry.notes}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}