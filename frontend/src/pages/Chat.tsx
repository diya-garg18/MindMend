import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2, Brain, User, Plus, History, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export default function Chat() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (user && token) {
      loadConversations();
      loadMostRecentConversation();
    }
  }, [user, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    if (!token) return;
    
    try {
      const response = await apiClient.getConversations(token);
      setConversations(response.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMostRecentConversation = async () => {
    if (!token) return;
    
    try {
      const response = await apiClient.getConversations(token);
      if (response.conversations && response.conversations.length > 0) {
        loadConversation(response.conversations[0].id);
      }
    } catch (error) {
      console.error('Error loading recent conversation:', error);
    }
  };

  const loadConversation = async (convId: string) => {
    if (!token) return;
    
    setIsLoadingHistory(true);
    setConversationId(convId);
    
    try {
      const response = await apiClient.getMessages(convId, token);
      if (response.messages) {
        setMessages(response.messages.map((m: any) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content
        })));
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !token) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to UI
    const userMsgId = crypto.randomUUID();
    const newUserMessage = { id: userMsgId, role: 'user' as const, content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Prepare messages for API
      const apiMessages = [...messages, newUserMessage]
        .map(m => ({ role: m.role, content: m.content }));

      // Call API
      const response = await apiClient.sendMessage(
        apiMessages,
        conversationId || undefined,
        token
      );

      // Update conversation ID if it was a new conversation
      if (!conversationId && response.conversationId) {
        setConversationId(response.conversationId);
        loadConversations(); // Refresh conversation list
      }

      // Add assistant message to UI
      const assistantMsgId = crypto.randomUUID();
      setMessages(prev => [...prev, {
        id: assistantMsgId,
        role: 'assistant',
        content: response.message.content
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Unable to send message',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
      // Remove the user message if sending failed
      setMessages(prev => prev.filter(m => m.id !== userMsgId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setInput('');
  };

  const selectConversation = (convId: string) => {
    loadConversation(convId);
  };

  const deleteConversation = async (convId: string) => {
    if (!token) return;

    try {
      await apiClient.deleteConversation(convId, token);

      toast({
        title: 'Conversation deleted',
        description: 'The conversation has been removed.',
      });

      // If we deleted the current conversation, start a new one
      if (convId === conversationId) {
        startNewChat();
      }

      loadConversations();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: 'Unable to delete',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between bg-background">
        <div>
          <h1 className="text-xl font-display font-semibold text-foreground">Chat with MindMend</h1>
          <p className="text-sm text-muted-foreground">Talk about anything on your mind</p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Chat History</SheetTitle>
                <SheetDescription>
                  Your previous conversations
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-2">
                {conversations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No conversations yet</p>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg transition-colors",
                        conv.id === conversationId
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      <button
                        onClick={() => selectConversation(conv.id)}
                        className="flex-1 text-left"
                      >
                        <p className="text-sm font-medium text-foreground truncate">
                          {conv.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(conv.created_at).toLocaleDateString()}
                        </p>
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this conversation and all its messages. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteConversation(conv.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Button variant="outline" size="sm" onClick={startNewChat}>
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl gradient-calm flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-lg font-display font-semibold text-foreground">
                Hi, I'm MindMend 💚
              </h2>
              <p className="text-muted-foreground">
                I'm here to listen and support you. Feel free to share what's on your mind — 
                whether it's stress about classes, relationships, or just how you're feeling today.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Remember: I'm here as a supportive companion, not a replacement for professional care.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3 animate-fade-in',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg gradient-calm flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <Card
                className={cn(
                  'max-w-[80%] p-4 shadow-sm',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground border-0'
                    : 'bg-card border-border'
                )}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.content || '...'}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </Card>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3 justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-lg gradient-calm flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <Card className="p-4 bg-card border-border">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-typing" />
                <span className="w-2 h-2 bg-primary rounded-full animate-typing" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-typing" style={{ animationDelay: '0.4s' }} />
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4 bg-background">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[52px] max-h-32 resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="gradient-calm text-primary-foreground px-4"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}