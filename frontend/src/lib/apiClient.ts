// API client configuration for MindMend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: 'Request failed' 
      }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async signup(email: string, password: string, displayName?: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe(token: string) {
    return this.request('/auth/me', { token });
  }

  async logout(token: string) {
    return this.request('/auth/logout', {
      method: 'POST',
      token,
    });
  }

  // Chat endpoints
  async sendMessage(messages: any[], conversationId?: string, token?: string) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ messages, conversationId }),
      token,
    });
  }

  async getConversations(token: string) {
    return this.request('/chat/conversations', { token });
  }

  async getMessages(conversationId: string, token: string) {
    return this.request(`/chat/conversations/${conversationId}/messages`, { token });
  }

  async deleteConversation(conversationId: string, token: string) {
    return this.request(`/chat/conversations/${conversationId}`, {
      method: 'DELETE',
      token,
    });
  }

  // Mood endpoints
  async createMoodEntry(data: any, token: string) {
    return this.request('/mood', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async getMoodEntries(params: any = {}, token: string) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/mood?${queryString}`, { token });
  }

  async getMoodStats(days: number = 30, token: string) {
    return this.request(`/mood/stats?days=${days}`, { token });
  }

  async updateMoodEntry(id: string, data: any, token: string) {
    return this.request(`/mood/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteMoodEntry(id: string, token: string) {
    return this.request(`/mood/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Journal endpoints
  async createJournalEntry(data: any, token: string) {
    return this.request('/journal', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async getJournalEntries(params: any = {}, token: string) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/journal?${queryString}`, { token });
  }

  async getJournalEntry(id: string, token: string) {
    return this.request(`/journal/${id}`, { token });
  }

  async updateJournalEntry(id: string, data: any, token: string) {
    return this.request(`/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteJournalEntry(id: string, token: string) {
    return this.request(`/journal/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Profile endpoints
  async getProfile(token: string) {
    return this.request('/profile', { token });
  }

  async updateProfile(data: any, token: string) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
