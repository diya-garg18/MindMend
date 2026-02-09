import { useState } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function EmergencyButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Check if we're on auth pages
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/reset-password';

  const handleShowAllResources = () => {
    setIsOpen(false);
    navigate('/crisis');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="fixed bottom-4 right-4 z-50 shadow-lg hover:shadow-xl transition-all rounded-full px-4 py-2 gap-2"
        >
          <Phone className="w-4 h-4" />
          <span className="hidden sm:inline">Emergency Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Need immediate help?</DialogTitle>
          <DialogDescription className="text-base">
            You're not alone. Help is available right now.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              If you're in crisis or having thoughts of suicide, please reach out:
            </p>
            <div className="space-y-2">
              <a
                href="tel:988"
                className="block p-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors"
              >
                <p className="font-semibold text-foreground">🇺🇸 USA: 988</p>
                <p className="text-sm text-muted-foreground">Suicide & Crisis Lifeline</p>
              </a>
              <a
                href="tel:9152987821"
                className="block p-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors"
              >
                <p className="font-semibold text-foreground">🇮🇳 India: 9152987821</p>
                <p className="text-sm text-muted-foreground">iCall Psychosocial Helpline</p>
              </a>
              <a
                href="tel:116123"
                className="block p-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors"
              >
                <p className="font-semibold text-foreground">🇬🇧 UK: 116 123</p>
                <p className="text-sm text-muted-foreground">Samaritans</p>
              </a>
            </div>
          </div>
          {/* Only show "View All Resources" when logged in or on non-auth pages */}
          {!isAuthPage && user && (
            <Button
              onClick={handleShowAllResources}
              className="w-full"
              variant="outline"
            >
              View All Crisis Resources
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
