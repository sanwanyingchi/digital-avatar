import type { Message } from '../types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
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
    // 构建上下文
    let context = '';
    if (contextFiles.length > 0) {
      context = `\n\n参考文档内容：\n${contextFiles.join('\n\n')}\n\n`;
    }

    // 构建对话历史
    const contents = messages.map(msg => ({
      parts: [{
        text: msg.sender === 'user' ? msg.text : msg.text
      }]
    }));

    // 添加当前用户消息
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'user') {
      contents[contents.length - 1].parts[0].text = context + lastMessage.text;
    }

    const requestBody: GeminiRequest = {
      contents,
      systemInstruction: systemPrompt ? {
        parts: [{
          text: systemPrompt
        }]
      } : undefined
    };

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