import { useState, useEffect } from 'react';
import './App.css';
import TopMenuBar from './components/TopMenuBar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import SettingsModal from './components/SettingsModal';
import FileUploadModal from './components/FileUploadModal';
import SessionListModal from './components/SessionListModal';
import { callGeminiAPI } from './services/gemini';
import { 
  getAllSessions, 
  getSession, 
  createNewSession, 
  updateSessionWithMessage,
  deleteSession,
  getCurrentSessionId,
  setCurrentSessionId,
  generateSessionTitle
} from './services/sessionManager';
import type { Message, Session, SessionSummary } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  
  const [avatarImage, setAvatarImage] = useState<string | undefined>(
    localStorage.getItem('avatar_image') || undefined
  );
  
  const [settings, setSettings] = useState({
    apiKey: localStorage.getItem('gemini_api_key') || 'AIzaSyDGm88T2C7hSqscAfkI_VWqRc2Ew5G92kc',
    systemPrompt: localStorage.getItem('system_prompt') || '你是万尺，一个友善、聪明且乐于助人的数字分身。请用中文回答问题，保持自然和亲切的语调。'
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // 初始化会话
  useEffect(() => {
    const currentSessionId = getCurrentSessionId();
    if (currentSessionId) {
      const session = getSession(currentSessionId);
      if (session) {
        setCurrentSession(session);
        setMessages(session.messages);
      } else {
        // 当前会话不存在，创建新会话
        const newSession = createNewSession();
        setCurrentSession(newSession);
        setMessages([]);
      }
    } else {
      // 没有当前会话，创建新会话
      const newSession = createNewSession();
      setCurrentSession(newSession);
      setMessages([]);
    }
    
    // 加载会话列表
    setSessions(getAllSessions());
  }, []);

  useEffect(() => {
    localStorage.setItem('gemini_api_key', settings.apiKey);
    localStorage.setItem('system_prompt', settings.systemPrompt);
  }, [settings]);

  useEffect(() => {
    if (avatarImage) {
      localStorage.setItem('avatar_image', avatarImage);
    } else {
      localStorage.removeItem('avatar_image');
    }
  }, [avatarImage]);

  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatarImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleNewSession = () => {
    const newSession = createNewSession();
    setCurrentSession(newSession);
    setMessages([]);
    setSessions(getAllSessions());
  };

  const handleSessionSelect = (sessionId: string) => {
    const session = getSession(sessionId);
    if (session) {
      setCurrentSession(session);
      setMessages(session.messages);
      setCurrentSessionId(sessionId);
    }
  };

  const handleSessionDelete = (sessionId: string) => {
    deleteSession(sessionId);
    setSessions(getAllSessions());
    
    // 如果删除的是当前会话，创建新会话
    if (currentSession?.id === sessionId) {
      handleNewSession();
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!settings.apiKey) {
      alert('请先在设置中配置 Gemini API Key');
      setShowSettings(true);
      return;
    }

    if (!currentSession) {
      alert('会话异常，请刷新页面重试');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    // 先添加用户消息到界面和会话
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    updateSessionWithMessage(currentSession.id, userMessage);
    
    // 如果是第一条消息，更新会话标题和列表
    if (messages.length === 0) {
      const updatedSession = getSession(currentSession.id);
      if (updatedSession) {
        setCurrentSession(updatedSession);
      }
      setSessions(getAllSessions());
    }
    
    setIsTyping(true);

    try {
      // 传递完整的对话历史给API
      const response = await callGeminiAPI(
        newMessages,
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

      // 添加AI回复到对话历史和会话
      setMessages(prev => [...prev, avatarMessage]);
      updateSessionWithMessage(currentSession.id, avatarMessage);
      setSessions(getAllSessions());
      
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '抱歉，我暂时无法回答你的问题。请检查网络连接和API配置。',
        sender: 'avatar',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      updateSessionWithMessage(currentSession.id, errorMessage);
      setSessions(getAllSessions());
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
      <TopMenuBar 
        avatarName="万尺" 
        avatarImage={avatarImage}
        currentSessionTitle={currentSession?.title}
        onAvatarUpload={handleAvatarUpload}
        onShowSessions={() => setShowSessions(true)}
        onNewSession={handleNewSession}
      />
      
      <div className="app-body">
        <ChatArea 
          messages={messages} 
          isTyping={isTyping} 
          avatarImage={avatarImage}
        />
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

      <SessionListModal
        isOpen={showSessions}
        onClose={() => setShowSessions(false)}
        sessions={sessions}
        currentSessionId={currentSession?.id || null}
        onSessionSelect={handleSessionSelect}
        onSessionDelete={handleSessionDelete}
        onNewSession={handleNewSession}
      />
    </div>
  );
}

export default App
