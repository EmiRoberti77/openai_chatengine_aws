import { UsageToken } from './Usage';

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
