import axios, { AxiosError } from 'axios';
import { ChatResponse } from './model/ChatResponse';
import ApiError from './ApiError';

export class CharServer {
  private endpoint: string;
  constructor() {
    this.endpoint = `http://localhost:5000/chat`;
  }

  private async postRequest(text: string): Promise<ChatResponse> {
    try {
      const response = await axios.post(this.endpoint, { text });
      const results = response.data.message.choices;
      if (results.length > 0) {
        console.log(results[0].message);
        return results[0].message;
      }

      return {
        content: 'no response',
        role: 'assistant',
      } as ChatResponse;
    } catch (error: ApiError | any) {
      return {
        content: error.message,
        role: 'assistant',
      } as ChatResponse;
    }
  }

  public async askServer(text: string): Promise<ChatResponse> {
    return await this.postRequest(text);
  }
}
