import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { apiKey: string; systemPrompt: string }) => void;
  currentSettings: { apiKey: string; systemPrompt: string };
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentSettings 
}) => {
  const [apiKey, setApiKey] = useState(currentSettings.apiKey);
  const [systemPrompt, setSystemPrompt] = useState(currentSettings.systemPrompt);

  const handleSave = () => {
    onSave({ apiKey, systemPrompt });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>设置</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="apiKey">Gemini API Key</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="请输入你的 Gemini API Key"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="systemPrompt">系统提示词</label>
            <textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="请输入系统提示词，定义你的数字分身角色和回答风格..."
              className="form-textarea"
              rows={6}
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            取消
          </button>
          <button className="btn-primary" onClick={handleSave}>
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;