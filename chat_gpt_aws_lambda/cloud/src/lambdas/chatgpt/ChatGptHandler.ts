import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import OpenAI from 'openai';
import { HTTP_CODE, jsonApiProxyResultResponse } from '../../util';
import { ChatGptQueryHandler } from './ChatGptQueryHandler';
import { ChatQueryParam } from './ChatQueryParam';
import { randomUUID } from 'crypto';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { timeStamp } from 'console';
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

  private async scan(): Promise<APIGatewayProxyResult> {
    try {
      const response = await new ChatGptQueryHandler().scan(5);
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

  private async getByUser(username: string): Promise<APIGatewayProxyResult> {
    try {
      const response = await new ChatGptQueryHandler().getQuery(username);
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

  public async get(): Promise<APIGatewayProxyResult> {
    if (!this.event.queryStringParameters) {
      return await this.scan();
    }
    const { username } = this.event.queryStringParameters;
    if (!username)
      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        message: false,
        body: 'missing username from queryStringParameters',
      });

    return this.getByUser(username);
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
      const d = new Date();
      const chatQueryParam: ChatQueryParam = {
        id: randomUUID(),
        username,
        timestamp: d.getTime(),
        createdAt: d.toISOString(),
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
