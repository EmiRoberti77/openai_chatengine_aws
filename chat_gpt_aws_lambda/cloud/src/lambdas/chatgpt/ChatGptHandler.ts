import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import OpenAI from 'openai';
import { HTTP_CODE, jsonApiProxyResultResponse } from '../../util';
import { API_KEY } from './Config';
import { ChatGptQueryHandler } from './ChatGptQueryHandler';
import { ChatQueryParam } from './ChatQueryParam';
import { randomUUID } from 'crypto';

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
      const { input, username } = JSON.parse(this.event.body);
      console.log(username, input);

      const openai = new (OpenAI as any)({
        apiKey: API_KEY,
      });

      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: input }], //do not use the username passed from the UI as chat gpt only uses ['system', 'assistant', 'user', 'function']
        model: 'gpt-3.5-turbo',
      });

      //prep query to be saved in dynamo table
      const chatQueryParam: ChatQueryParam = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        userInput: {
          user: username,
          role: 'user',
          input,
        },
        chatCompletion,
      };
      //save to dynamo
      await new ChatGptQueryHandler(chatQueryParam).saveQuery();

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
