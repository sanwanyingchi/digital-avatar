import React, { useRef, useEffect } from 'react';
import type { Message } from '../types';
import ChatMessage from './ChatMessage';

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
  avatarImage?: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, isTyping, avatarImage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="chat-area">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-avatar">
              {avatarImage ? (
                <img src={avatarImage} alt="Avatar" style={{ width: '5rem', height: '5rem', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                '🤖'
              )}
            </div>
            <div className="welcome-text">
              <h2>万尺</h2>
              <p>烦闷的时候，我燃烧很多尼古丁，有什么想跟我聊的？</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} avatarImage={avatarImage} />
          ))
        )}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="message avatar-message">
              <div className="message-content">
                <div className={`message-avatar ${avatarImage ? 'custom-avatar' : ''}`}>
                  {avatarImage ? (
                    <img src={avatarImage} alt="Avatar" />
                  ) : (
                    '🤖'
                  )}
                </div>
                <div className="message-bubble">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatArea;