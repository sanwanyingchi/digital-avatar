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