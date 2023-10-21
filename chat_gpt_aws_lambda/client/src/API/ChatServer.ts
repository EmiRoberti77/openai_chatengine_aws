import axios from 'axios';
import {
  ChatInput,
  ChatResponse,
  fillChatResponse,
} from './model/ChatResponse';
import ApiError from './ApiError';
import { UsageToken } from './model/Usage';
import { ChatHistory } from './model/ChatHistory';
import { SavedChatHistory } from './model/SaveChatHistory';

export class CharServer {
  private endpoint: string;
  constructor() {
    this.endpoint = process.env.REACT_APP_API_END_POINT!;
  }

  private async postRequest(chatInput: ChatInput): Promise<ChatResponse> {
    try {
      const response = await axios.post(this.endpoint, chatInput, {
        headers: {
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
      });
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

  public async getSavedChats(): Promise<SavedChatHistory[] | undefined> {
    try {
      const response = await axios.get(this.endpoint, {
        headers: {
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
      });
      return response.data.body as SavedChatHistory[];
    } catch (error: any) {
      console.error(error.message);
      return undefined;
    }
  }

  public async askServer(chatInput: ChatInput): Promise<ChatResponse> {
    return await this.postRequest(chatInput);
  }

  private fillResponse(
    content: string = 'no response',
    role: string,
    usage: UsageToken
  ): ChatResponse {
    return fillChatResponse(content, role, usage);
  }
}
