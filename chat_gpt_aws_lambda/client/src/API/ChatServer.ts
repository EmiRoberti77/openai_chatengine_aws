import axios, { AxiosError } from 'axios';
import { ChatResponse, getChatResponse } from './model/ChatResponse';
import ApiError from './ApiError';

export class CharServer {
  private endpoint: string;
  constructor() {
    this.endpoint = `https://a7zbcv29gc.execute-api.us-east-1.amazonaws.com/prod/chat`;
  }

  private async postRequest(text: string): Promise<ChatResponse> {
    try {
      const response = await axios.post(this.endpoint, { text });
      const results = response.data.body.choices;

      if (results) {
        const { role, content } = results[0].message;
        return this.fillResponse(content);
      }
      return this.fillResponse();
    } catch (error: ApiError | any) {
      return this.fillResponse(error.message);
    }
  }

  public async askServer(text: string): Promise<ChatResponse> {
    return await this.postRequest(text);
  }

  private fillResponse(content: string = 'no response'): ChatResponse {
    return getChatResponse(content);
  }
}
