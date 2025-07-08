import React from 'react';

interface TopMenuBarProps {
  avatarName: string;
  avatarImage?: string;
  onAvatarUpload: (file: File) => void;
}

const TopMenuBar: React.FC<TopMenuBarProps> = ({ avatarName, avatarImage, onAvatarUpload }) => {
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
          <h1 className="menu-title">Talking with {avatarName}</h1>
        </div>
        <div className="menu-actions">
          <button className="menu-btn" title="Settings">⚙️</button>
          <button className="menu-btn" title="Files">📁</button>
        </div>
      </div>
    </div>
  );
};

export default TopMenuBar;