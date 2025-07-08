import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import ChatMessage from './ChatMessage';

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, isTyping }) => {
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
            <div className="welcome-avatar">🤖</div>
            <div className="welcome-text">
              <h2>你好！我是万尺</h2>
              <p>我是你的数字分身，很高兴与你对话！有什么我可以帮助你的吗？</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="message avatar-message">
              <div className="message-content">
                <div className="message-avatar">🤖</div>
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