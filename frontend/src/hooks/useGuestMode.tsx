import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GuestMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface GuestModeContextType {
  isGuest: boolean;
  setIsGuest: (value: boolean) => void;
  guestMessages: GuestMessage[];
  addGuestMessage: (role: 'user' | 'assistant', content: string) => void;
  clearGuestData: () => void;
}

const GuestModeContext = createContext<GuestModeContextType | undefined>(undefined);

export function GuestModeProvider({ children }: { children: ReactNode }) {
  const [isGuest, setIsGuest] = useState(false);
  const [guestMessages, setGuestMessages] = useState<GuestMessage[]>([]);

  // Load guest messages from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('mindmend-guest-messages');
    if (stored) {
      try {
        setGuestMessages(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse guest messages:', e);
      }
    }
  }, []);

  // Save guest messages to sessionStorage whenever they change
  useEffect(() => {
    if (guestMessages.length > 0) {
      sessionStorage.setItem('mindmend-guest-messages', JSON.stringify(guestMessages));
    }
  }, [guestMessages]);

  const addGuestMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: GuestMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: Date.now(),
    };
    setGuestMessages(prev => [...prev, newMessage]);
  };

  const clearGuestData = () => {
    setGuestMessages([]);
    sessionStorage.removeItem('mindmend-guest-messages');
    setIsGuest(false);
  };

  return (
    <GuestModeContext.Provider value={{ isGuest, setIsGuest, guestMessages, addGuestMessage, clearGuestData }}>
      {children}
    </GuestModeContext.Provider>
  );
}

export function useGuestMode() {
  const context = useContext(GuestModeContext);
  if (context === undefined) {
    throw new Error('useGuestMode must be used within a GuestModeProvider');
  }
  return context;
}
