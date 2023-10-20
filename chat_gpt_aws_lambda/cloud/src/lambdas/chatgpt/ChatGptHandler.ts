import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import OpenAI from 'openai';
import { HTTP_CODE, jsonApiProxyResultResponse } from '../../util';
import { ChatGptQueryHandler } from './ChatGptQueryHandler';
import { ChatQueryParam } from './ChatQueryParam';
import { randomUUID } from 'crypto';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
const ssmClient = new SSMClient({});
export class ChatGptHandler {
  private event: APIGatewayProxyEvent;

  constructor(event: APIGatewayProxyEvent) {
    this.event = event;
  }

  private async getSecret(key: string): Promise<string | undefined> {
    const command = new GetParameterCommand({
      Name: key,
      WithDecryption: false,
    });
    const response = await ssmClient.send(command);
    const keyValue = response.Parameter?.Value;
    return keyValue;
  }

  public async get(): Promise<APIGatewayProxyResult> {
    try {
      const response = await new ChatGptQueryHandler().getQuery(5);
      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        message: true,
        body: response,
      });
    } catch (error: any) {
      return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
        message: false,
        body: error.message,
      });
    }
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

      const openAiKey = await this.getSecret('chat_gpt_api_key');
      if (!this.event.body) {
        return jsonApiProxyResultResponse(HTTP_CODE.NOT_FOUND, {
          message: false,
          body: 'missing chat_gpt_api_key',
        });
      }

      const openai = new (OpenAI as any)({
        apiKey: openAiKey,
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
