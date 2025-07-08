import React from 'react';

interface TopMenuBarProps {
  avatarName: string;
}

const TopMenuBar: React.FC<TopMenuBarProps> = ({ avatarName }) => {
  return (
    <div className="top-menu-bar">
      <div className="menu-content">
        <div className="avatar-info">
          <div className="avatar-icon">🤖</div>
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