// Shared types between frontend and backend

export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title?: string;
  agentType: string;
  updatedAt: string;
}

export interface Memory {
  id: string;
  content: string;
  memoryType: 'long_term' | 'session' | 'fact' | 'preference';
  importance: number;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  description: string;
  isActive: boolean;
}

export interface ScreenAnalysis {
  screenDescription: string;
  uiElements: Array<{
    type: string;
    text?: string;
    position?: string;
  }>;
  suggestedAction: string;
  confidence: number;
}

export interface Permission {
  permission: string;
  granted: boolean;
  grantedAt?: string;
}