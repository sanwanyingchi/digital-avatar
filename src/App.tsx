import { useState, useEffect } from 'react';
import './App.css';
import TopMenuBar from './components/TopMenuBar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import SettingsModal from './components/SettingsModal';
import FileUploadModal from './components/FileUploadModal';
import { callGeminiAPI } from './services/gemini';
import type { Message } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  
  const [settings, setSettings] = useState({
    apiKey: localStorage.getItem('gemini_api_key') || '',
    systemPrompt: localStorage.getItem('system_prompt') || '你是万尺，一个友善、聪明且乐于助人的数字分身。请用中文回答问题，保持自然和亲切的语调。'
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('gemini_api_key', settings.apiKey);
    localStorage.setItem('system_prompt', settings.systemPrompt);
  }, [settings]);

  const handleSendMessage = async (text: string) => {
    if (!settings.apiKey) {
      alert('请先在设置中配置 Gemini API Key');
      setShowSettings(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await callGeminiAPI(
        [...messages, userMessage],
        settings.apiKey,
        settings.systemPrompt,
        uploadedFiles
      );

      const avatarMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'avatar',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, avatarMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '抱歉，我暂时无法回答你的问题。请检查网络连接和API配置。',
        sender: 'avatar',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSettingsSave = (newSettings: { apiKey: string; systemPrompt: string }) => {
    setSettings(newSettings);
  };

  const handleFileUpload = (files: File[]) => {
    // 这里应该实现文件上传和处理逻辑
    // 现在只是模拟添加文件名
    const fileNames = files.map(file => file.name);
    setUploadedFiles(prev => [...prev, ...fileNames]);
  };

  return (
    <div className="app">
      <TopMenuBar avatarName="万尺" />
      
      <div className="app-body">
        <ChatArea messages={messages} isTyping={isTyping} />
        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>

      <div className="floating-buttons">
        <button 
          className="floating-btn"
          onClick={() => setShowSettings(true)}
          title="设置"
        >
          ⚙️
        </button>
        <button 
          className="floating-btn"
          onClick={() => setShowFileUpload(true)}
          title="上传文件"
        >
          📁
        </button>
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSettingsSave}
        currentSettings={settings}
      />

      <FileUploadModal
        isOpen={showFileUpload}
        onClose={() => setShowFileUpload(false)}
        onUpload={handleFileUpload}
        uploadedFiles={uploadedFiles}
      />
    </div>
  );
}

export default App
