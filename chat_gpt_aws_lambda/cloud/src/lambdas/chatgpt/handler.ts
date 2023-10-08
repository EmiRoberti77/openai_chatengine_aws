import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HTTP_METHOD } from '../../util';
import { ChatGptHandler } from './ChatGptHandler';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const api = new ChatGptHandler(event);
  switch (event.httpMethod) {
    case HTTP_METHOD.GET:
      return await api.get();
    case HTTP_METHOD.POST:
      return await api.post();
    default:
      return await api.noService();
  }
};
