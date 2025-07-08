import type { Message } from '../types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

interface GeminiContent {
  role: 'user' | 'model';
  parts: {
    text: string;
  }[];
}

interface GeminiRequest {
  contents: GeminiContent[];
  systemInstruction?: {
    parts: {
      text: string;
    }[];
  };
}

export const callGeminiAPI = async (
  messages: Message[],
  apiKey: string,
  systemPrompt: string,
  contextFiles: string[]
): Promise<string> => {
  try {
    // 构建文档上下文（只在第一条用户消息中添加）
    let contextText = '';
    if (contextFiles.length > 0) {
      contextText = `\n\n参考文档内容：\n${contextFiles.join('\n\n')}\n\n`;
    }

    // 构建对话历史，确保正确的角色映射
    const contents: GeminiContent[] = [];
    
    messages.forEach((msg, index) => {
      const role = msg.sender === 'user' ? 'user' : 'model';
      let text = msg.text;
      
      // 只在第一条用户消息中添加文档上下文
      if (msg.sender === 'user' && index === 0 && contextText) {
        text = contextText + msg.text;
      }
      
      contents.push({
        role,
        parts: [{ text }]
      });
    });

    // 确保最后一条消息是用户消息（Gemini API要求）
    const lastMessage = contents[contents.length - 1];
    if (lastMessage?.role !== 'user') {
      throw new Error('Last message must be from user');
    }

    const requestBody: GeminiRequest = {
      contents,
      systemInstruction: systemPrompt ? {
        parts: [{
          text: systemPrompt
        }]
      } : undefined
    };

    console.log('Sending to Gemini:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Gemini response:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('No response generated');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};