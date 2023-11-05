import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  HTTP_CODE,
  allModels,
  jsonApiProxyResultResponse,
  validateGenAIengine,
} from '../../util';
import axios, { AxiosResponse } from 'axios';
import { ChatQueryParam } from '../chatgpt/ChatQueryParam';
import { randomUUID } from 'crypto';
import { ChatGptQueryHandler } from '../database/ChatGptQueryHandler';

//TODO:add to secrets
const ENDPOINT = `https://ehadblk3gl.execute-api.us-east-1.amazonaws.com/Stage/bedrock`;
export class BedrockHandler {
  private event: APIGatewayProxyEvent;

  constructor(event: APIGatewayProxyEvent) {
    this.event = event;
  }

  public async post(): Promise<APIGatewayProxyResult> {
    if (!this.event.body) {
      return jsonApiProxyResultResponse(HTTP_CODE.BAD_REQUEST, {
        message: false,
        body: 'missing bedrock body in request',
      });
    }

    const body = JSON.parse(this.event.body);
    const { input, username, engine } = body;

    console.info(username, input, engine);

    try {
      if (!validateGenAIengine(engine)) {
        return jsonApiProxyResultResponse(HTTP_CODE.NOT_FOUND, {
          message: false,
          body: `missing correct ai engine, models supported are: ${allModels}`,
        });
      }

      const response: AxiosResponse = await axios.post(ENDPOINT, body);
      console.info(response.data);

      //save data to dynamo
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
        chatCompletion: response.data,
        engine,
      };
      //save to dynamo
      await new ChatGptQueryHandler(chatQueryParam).saveQuery();

      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        message: true,
        body: response.data,
      });
    } catch (error: any) {
      return jsonApiProxyResultResponse(HTTP_CODE.ERROR, {
        message: false,
        body: error.message,
      });
    }
  }

  public async get(): Promise<APIGatewayProxyResult> {
    return jsonApiProxyResultResponse(HTTP_CODE.OK, {
      message: true,
      event: this.event,
      body: 'bedrock get has been invoked',
    });
  }
}
