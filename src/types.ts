export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'avatar';
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionSummary {
  id: string;
  title: string;
  lastMessage: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}