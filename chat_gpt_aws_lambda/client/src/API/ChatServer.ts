import axios, { AxiosError } from 'axios';
import { ChatResponse } from './model/ChatResponse';
import ApiError from './ApiError';

export class CharServer {
  private endpoint: string;
  constructor() {
    this.endpoint = ``;
  }

  private async postRequest(text: string): Promise<ChatResponse> {
    try {
      const response = await axios.post(this.endpoint, { text });
      const results = response.data.body.choices;
      if (results && results.length > 0) {
        const { role, content } = results[0];
        return this.fillResponse(role, content);
      }
      return this.fillResponse();
    } catch (error: ApiError | any) {
      return this.fillResponse('assistant', error.message);
    }
  }

  public async askServer(text: string): Promise<ChatResponse> {
    return await this.postRequest(text);
  }

  private fillResponse(
    role: string = 'assistant',
    content: string = 'no response'
  ): ChatResponse {
    return {
      role,
      content,
    };
  }
}
