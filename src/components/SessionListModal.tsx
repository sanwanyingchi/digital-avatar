import React from 'react';
import type { SessionSummary } from '../types';

interface SessionListModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SessionSummary[];
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onSessionDelete: (sessionId: string) => void;
  onNewSession: () => void;
}

const SessionListModal: React.FC<SessionListModalProps> = ({ 
  isOpen, 
  onClose, 
  sessions, 
  currentSessionId,
  onSessionSelect,
  onSessionDelete,
  onNewSession
}) => {
  if (!isOpen) return null;

  const handleSessionClick = (sessionId: string) => {
    onSessionSelect(sessionId);
    onClose();
  };

  const handleDeleteClick = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (confirm('确定要删除这个对话吗？此操作无法撤销。')) {
      onSessionDelete(sessionId);
    }
  };

  const handleNewSession = () => {
    onNewSession();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content session-modal">
        <div className="modal-header">
          <h2>对话历史</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="session-actions">
            <button className="btn-primary new-session-btn" onClick={handleNewSession}>
              ✨ 新建对话
            </button>
          </div>
          
          <div className="session-list">
            {sessions.length === 0 ? (
              <div className="empty-sessions">
                <div className="empty-icon">💬</div>
                <p>还没有对话记录</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div 
                  key={session.id}
                  className={`session-item ${session.id === currentSessionId ? 'active' : ''}`}
                  onClick={() => handleSessionClick(session.id)}
                >
                  <div className="session-content">
                    <div className="session-title">{session.title}</div>
                    <div className="session-preview">{session.lastMessage}</div>
                    <div className="session-meta">
                      <span className="message-count">{session.messageCount} 条消息</span>
                      <span className="session-time">
                        {session.updatedAt.toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </div>
                  <div className="session-actions-mini">
                    <button 
                      className="delete-btn"
                      onClick={(e) => handleDeleteClick(e, session.id)}
                      title="删除对话"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionListModal;