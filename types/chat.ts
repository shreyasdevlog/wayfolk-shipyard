// Chat-related type definitions
// These types support future AI integration for smart replies and image analysis

import { RigType } from '@/components/chat/RigIcon';

export interface ChatUser {
  id: string;
  name: string;
  rigType: RigType;
  sharedDestination?: string;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'recipient';
  timestamp: Date;
  // AI-ready fields for future features
  aiGenerated?: boolean; // For smart replies
  aiAnalysis?: {
    // For image analysis
    type?: 'van-build' | 'location' | 'campsite' | 'other';
    description?: string;
    tags?: string[];
  };
  media?: {
    type: 'image' | 'video';
    uri: string;
    thumbnail?: string;
  };
}

export interface Conversation {
  id: string;
  participants: ChatUser[];
  lastMessage: ChatMessage;
  unreadCount: number;
  sharedRoute?: {
    destination: string;
    distance?: number;
    eta?: Date;
  };
}

// AI Integration types for Newell AI
export interface SmartReplyRequest {
  conversationId: string;
  messageHistory: ChatMessage[];
  context?: {
    location?: string;
    destination?: string;
    rigType?: RigType;
  };
}

export interface SmartReplyResponse {
  replies: string[];
  confidence: number;
}

export interface ImageAnalysisRequest {
  imageUri: string;
  analysisType: 'van-build' | 'location' | 'general';
}

export interface ImageAnalysisResponse {
  description: string;
  tags: string[];
  suggestions?: string[];
}
