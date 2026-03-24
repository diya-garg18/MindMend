import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const reminders = [
  { title: "You Matter 💚", message: "Your feelings are valid, and it's okay to take things one step at a time." },
  { title: "Breathe 🌿", message: "Take a deep breath. Inhale calm, exhale tension. You've got this." },
  { title: "Be Kind to Yourself 🌸", message: "Treat yourself with the same kindness you'd show a good friend." },
  { title: "Progress, Not Perfection ✨", message: "Every small step forward counts. Celebrate your effort today." },
  { title: "You Are Enough 🌻", message: "You don't have to earn your worth. You are enough just as you are." },
  { title: "Rest Is Productive 🌙", message: "Taking a break isn't giving up — it's recharging for what's ahead." },
  { title: "Stay Present 🧘", message: "The past is behind you, the future will come. Focus on this moment." },
  { title: "Reach Out 🤝", message: "You don't have to face everything alone. It's okay to ask for help." },
  { title: "Celebrate Small Wins 🎉", message: "Did you get out of bed? Drink water? That counts. Be proud." },
  { title: "Let Go of What You Can't Control 🍃", message: "Focus your energy on what's within your power. Release the rest." },
  { title: "You've Survived Every Bad Day So Far 💪", message: "Your track record of getting through tough times is 100%." },
  { title: "Hydrate & Nourish 💧", message: "Your body and mind are connected. A glass of water can be a fresh start." },
  { title: "It's Okay to Feel 🌈", message: "All emotions — happy, sad, angry — are part of being human. Let them flow." },
  { title: "Gratitude Shift 🙏", message: "Think of one thing you're grateful for right now. Let that warmth fill you." },
  { title: "You Are Not Your Thoughts 🧠", message: "Thoughts come and go like clouds. You are the sky — vast and steady." },
  { title: "Smile at Yourself 😊", message: "Look in the mirror and give yourself a genuine smile. You deserve it." },
  { title: "Set a Boundary Today 🛡️", message: "Saying 'no' to something that drains you is saying 'yes' to yourself." },
  { title: "Move Your Body 🏃", message: "Even a short walk or stretch can shift your mood. Try it!" },
  { title: "Disconnect to Reconnect 📵", message: "Take a few minutes away from screens. Notice the world around you." },
  { title: "You're Growing 🌱", message: "Even on days that feel stagnant, you're learning and evolving." },
  { title: "Slow Down 🐢", message: "You don’t have to rush everything. Take your time — you’re not falling behind." },
  { title: "One Step Is Enough 👣", message: "You don’t need to solve everything today. Just take the next small step." },
  { title: "Your Effort Matters 💫", message: "Even if no one sees it, your effort is real and meaningful." },
  { title: "It’s Okay to Pause ⏸️", message: "Pausing doesn’t mean quitting. It means you’re giving yourself space to breathe." },
  { title: "You Deserve Peace 🕊️", message: "You are allowed to choose calm over chaos and protect your peace." },
  { title: "Feel, Don’t Suppress 🌊", message: "Let your emotions come and go. You don’t need to hide how you feel." },
  { title: "You’re Doing Better Than You Think 🌟", message: "Even if it doesn’t feel like it, you are making progress." },
  { title: "Start Again 🔄", message: "Today didn’t go as planned? That’s okay. You can always begin again." },
  { title: "Be Patient With Yourself ⏳", message: "Growth takes time. You’re not supposed to have everything figured out." },
  { title: "You Are Not Alone 🤍", message: "Someone, somewhere understands what you're going through." },
  { title: "Let Yourself Rest 🛌", message: "Rest is not a reward — it’s a necessity." },
  { title: "Release the Pressure 🎈", message: "You don’t have to be perfect. You just have to be real." },
  { title: "You Can Handle This 💪", message: "You’ve handled hard things before — you can do it again." },
  { title: "Your Feelings Will Pass ⛅", message: "No feeling is permanent. This moment will change." },
  { title: "Be Present 🌼", message: "Right now, in this moment, you are safe. Stay here." },
  { title: "Give Yourself Credit 👏", message: "Look how far you’ve come, even if it doesn’t feel like much." },
  { title: "It’s Okay to Not Know ❓", message: "You don’t need all the answers right now." },
  { title: "Take Care of You 💖", message: "You matter too. Don’t forget to show up for yourself." },
  { title: "You’re Allowed to Feel Tired 😴", message: "Being tired doesn’t make you weak — it means you’ve been trying." },
  { title: "Keep Going 🌈", message: "Even if it’s slow, even if it’s messy — just keep going." },
];

export default function DailyReminderPopup() {
  const [open, setOpen] = useState(false);
  const [reminder, setReminder] = useState(reminders[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * reminders.length);
    setReminder(reminders[randomIndex]);
    setOpen(true);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl">{reminder.title}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {reminder.message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-2">
          <Button onClick={() => setOpen(false)} className="px-8">
            Let's Go! 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
