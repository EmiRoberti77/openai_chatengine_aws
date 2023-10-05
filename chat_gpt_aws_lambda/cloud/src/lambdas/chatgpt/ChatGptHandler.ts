import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import OpenAI from 'openai';
import { HTTP_CODE, jsonApiProxyResultResponse } from '../../util';
import { json } from 'stream/consumers';
import { API_KEY } from './Config';

export class ChatGptHandler {
  private event: APIGatewayProxyEvent;
  constructor(event: APIGatewayProxyEvent) {
    this.event = event;
  }

  public async get(): Promise<APIGatewayProxyResult> {
    return jsonApiProxyResultResponse(HTTP_CODE.OK, {
      message: true,
      body: 'Handler GET',
    });
  }

  public async noService(): Promise<APIGatewayProxyResult> {
    return jsonApiProxyResultResponse(HTTP_CODE.OK, {
      message: true,
      body: 'No http method',
    });
  }

  public async post(): Promise<APIGatewayProxyResult> {
    try {
      if (!this.event.body) {
        return jsonApiProxyResultResponse(HTTP_CODE.NOT_FOUND, {
          message: false,
          body: 'missing body',
        });
      }
      const { text } = JSON.parse(this.event.body);
      console.log(text);

      const openai = new (OpenAI as any)({
        apiKey: API_KEY,
      });

      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: text }],
        model: 'gpt-3.5-turbo',
      });

      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        message: true,
        body: chatCompletion,
      });
    } catch (error: any) {
      console.error(error);
      return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
        message: false,
        body: error.message,
      });
    }
  }
}
