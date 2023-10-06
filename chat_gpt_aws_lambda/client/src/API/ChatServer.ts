import axios, { AxiosError } from 'axios';
import {
  ChatResponse,
  fillChatResponse,
  getChatResponse,
} from './model/ChatResponse';
import ApiError from './ApiError';
import { UsageToken } from './model/Usage';

export class CharServer {
  private endpoint: string;
  constructor() {
    this.endpoint = `https://a7zbcv29gc.execute-api.us-east-1.amazonaws.com/prod/chat`;
  }

  private async postRequest(text: string): Promise<ChatResponse> {
    try {
      const response = await axios.post(this.endpoint, { text });
      const results = response.data.body.choices;
      const usage: UsageToken = response.data.body.usage;

      if (results) {
        const { role, content } = results[0].message;
        return this.fillResponse(content, role, usage);
      }
      return this.fillResponse('no response', 'assistant', usage);
    } catch (error: ApiError | any) {
      return this.fillResponse(error.message, 'assistant', {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      });
    }
  }

  public async askServer(text: string): Promise<ChatResponse> {
    return await this.postRequest(text);
  }

  private fillResponse(
    content: string = 'no response',
    role: string,
    usage: UsageToken
  ): ChatResponse {
    return fillChatResponse(content, role, usage);
  }
}
