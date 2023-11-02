import { Usage } from './SaveChatHistory';
import { UsageToken } from './Usage';

export interface ChatInput {
  username: string;
  input: string;
  engine: string;
}

export interface ChatResponse {
  content: string;
  role: string;
  usage: UsageToken;
}

export const getChatResponse = (message: string) => {
  return fillChatResponse(message, 'assistant', {
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0,
  });
};

export const fillChatResponse = (
  content: string,
  role: string,
  usage: UsageToken
): ChatResponse => {
  return {
    content,
    role,
    usage,
  };
};

export const fillSampleChatResponse = (content: string, role: string) => {
  const usage: Usage = {
    prompt_tokens: 10,
    completion_tokens: 10,
    total_tokens: 20,
  };
  const response: ChatResponse = {
    content,
    role,
    usage,
  };

  return response;
};
