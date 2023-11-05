import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HTTP_CODE, HTTP_METHOD, jsonApiProxyResultResponse } from '../util';
import { ChatGptHandler } from './chatgpt/ChatGptHandler';
import { BedrockHandler } from './bedrock/BedrockHandler';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const api = new ChatGptHandler(event);
  switch (event.httpMethod) {
    case HTTP_METHOD.GET:
      return await api.get();
    case HTTP_METHOD.POST:
      return await post(event);
    default:
      return await api.noService();
  }
};

const post = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body)
    return jsonApiProxyResultResponse(HTTP_CODE.NOT_FOUND, {
      message: false,
      body: 'missing body',
    });

  const { engine } = JSON.parse(event.body);
  if (engine.startsWith('chat')) {
    const api = new ChatGptHandler(event);
    return await api.post();
  } else {
    const api = new BedrockHandler(event);
    return await api.post();
  }
};
