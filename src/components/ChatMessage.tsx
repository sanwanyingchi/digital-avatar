import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  avatarImage?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, avatarImage }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`message ${isUser ? 'user-message' : 'avatar-message'}`}>
      <div className="message-content">
        <div className={`message-avatar ${isUser ? 'user-avatar' : ''} ${avatarImage && !isUser ? 'custom-avatar' : ''}`}>
          {isUser ? (
            '👤'
          ) : avatarImage ? (
            <img src={avatarImage} alt="Avatar" />
          ) : (
            '🤖'
          )}
        </div>
        <div className="message-bubble">
          <div className="message-text">{message.text}</div>
          <div className="message-time">
            {message.timestamp.toLocaleTimeString('zh-CN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;