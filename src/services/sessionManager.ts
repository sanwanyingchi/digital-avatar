import type { Session, SessionSummary, Message } from '../types';

const SESSION_STORAGE_KEY = 'chat_sessions';
const CURRENT_SESSION_KEY = 'current_session_id';

export const generateSessionId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const generateSessionTitle = (messages: Message[]): string => {
  if (messages.length === 0) return '新对话';
  
  const firstUserMessage = messages.find(msg => msg.sender === 'user');
  if (!firstUserMessage) return '新对话';
  
  // 取前20个字符作为标题
  const title = firstUserMessage.text.slice(0, 20);
  return title.length < firstUserMessage.text.length ? title + '...' : title;
};

export const getAllSessions = (): SessionSummary[] => {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return [];
    
    const sessions: Session[] = JSON.parse(stored);
    return sessions
      .map(session => ({
        id: session.id,
        title: session.title,
        lastMessage: session.messages.length > 0 
          ? session.messages[session.messages.length - 1].text.slice(0, 50) + 
            (session.messages[session.messages.length - 1].text.length > 50 ? '...' : '')
          : '暂无消息',
        messageCount: session.messages.length,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt)
      }))
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch (error) {
    console.error('Error loading sessions:', error);
    return [];
  }
};

export const getSession = (sessionId: string): Session | null => {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;
    
    const sessions: Session[] = JSON.parse(stored);
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
      // 转换日期字符串为Date对象
      return {
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
};

export const saveSession = (session: Session): void => {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    const sessions: Session[] = stored ? JSON.parse(stored) : [];
    
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

export const deleteSession = (sessionId: string): void => {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return;
    
    const sessions: Session[] = JSON.parse(stored);
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(filteredSessions));
    
    // 如果删除的是当前会话，清除当前会话ID
    const currentSessionId = getCurrentSessionId();
    if (currentSessionId === sessionId) {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    }
  } catch (error) {
    console.error('Error deleting session:', error);
  }
};

export const getCurrentSessionId = (): string | null => {
  return localStorage.getItem(CURRENT_SESSION_KEY);
};

export const setCurrentSessionId = (sessionId: string): void => {
  localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
};

export const createNewSession = (): Session => {
  const sessionId = generateSessionId();
  const now = new Date();
  
  const newSession: Session = {
    id: sessionId,
    title: '新对话',
    messages: [],
    createdAt: now,
    updatedAt: now
  };
  
  saveSession(newSession);
  setCurrentSessionId(sessionId);
  
  return newSession;
};

export const updateSessionWithMessage = (sessionId: string, message: Message): void => {
  const session = getSession(sessionId);
  if (!session) return;
  
  session.messages.push(message);
  session.updatedAt = new Date();
  
  // 如果是第一条用户消息，更新会话标题
  if (session.messages.length === 1 && message.sender === 'user') {
    session.title = generateSessionTitle(session.messages);
  }
  
  saveSession(session);
};