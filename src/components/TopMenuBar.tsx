import React from 'react';

interface TopMenuBarProps {
  avatarName: string;
  avatarImage?: string;
  currentSessionTitle?: string;
  onAvatarUpload: (file: File) => void;
  onShowSessions: () => void;
  onNewSession: () => void;
}

const TopMenuBar: React.FC<TopMenuBarProps> = ({ 
  avatarName, 
  avatarImage, 
  currentSessionTitle,
  onAvatarUpload,
  onShowSessions,
  onNewSession
}) => {
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarUpload(file);
    }
  };

  return (
    <div className="top-menu-bar">
      <div className="menu-content">
        <div className="avatar-info">
          <div className={`avatar-icon ${avatarImage ? 'custom-avatar' : ''}`}>
            {avatarImage ? (
              <img src={avatarImage} alt="Avatar" />
            ) : (
              '🤖'
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="avatar-upload-btn"
            />
            <div className="avatar-upload-overlay">
              点击上传头像
            </div>
          </div>
          <div className="title-section">
            <h1 className="menu-title">Talking with {avatarName}</h1>
            {currentSessionTitle && (
              <div className="session-title">{currentSessionTitle}</div>
            )}
          </div>
        </div>
        <div className="menu-actions">
          <button 
            className="menu-btn" 
            onClick={onNewSession}
            title="新建对话"
          >
            ✨
          </button>
          <button 
            className="menu-btn" 
            onClick={onShowSessions}
            title="对话历史"
          >
            💬
          </button>
          <button className="menu-btn" title="设置">⚙️</button>
          <button className="menu-btn" title="文件">📁</button>
        </div>
      </div>
    </div>
  );
};

export default TopMenuBar;