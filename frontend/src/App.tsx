import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { GuestModeProvider } from "@/hooks/useGuestMode";
import { MusicPlayerProvider } from '@/hooks/useMusicPlayer';
import FloatingMusicPlayer from '@/components/FloatingMusicPlayer';
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import EmergencyButton from "@/components/EmergencyButton";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Mood from "./pages/Mood";
import SelfHelp from "./pages/SelfHelp";
import Journal from "./pages/Journal";
import Crisis from "./pages/Crisis";
import Profile from "./pages/Profile";
import Resources from "./pages/Resources";
import GuestChat from "./pages/GuestChat";
import NotFound from "./pages/NotFound";
import DailyReminderPopup from "@/components/DailyReminderPopup";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <GuestModeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <MusicPlayerProvider>
            <BrowserRouter basename="/MindMend">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/guest-chat" element={<GuestChat />} />
                
                {/* Protected routes with sidebar layout */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Dashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Chat />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mood"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Mood />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/self-help"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <SelfHelp />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/journal"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Journal />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crisis"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Crisis />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resources"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Resources />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Profile />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              {/* Emergency button visible everywhere */}
              <EmergencyButton />
              <FloatingMusicPlayer />
              <DailyReminderPopup />
            </BrowserRouter>
            </MusicPlayerProvider>
          </TooltipProvider>
        </GuestModeProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
