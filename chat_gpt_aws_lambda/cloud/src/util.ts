import { APIGatewayProxyResult } from 'aws-lambda';

export enum HTTP_CODE {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  ERROR = 500,
}

export function addCorsHeader(arg: APIGatewayProxyResult) {
  if (!arg.headers) {
    arg.headers = {};
  }
  arg.headers['Access-Control-Allow-Origin'] = '*';
  arg.headers['Access-Control-Allow-Methods'] = '*';
}

export const jsonApiProxyResultResponse = (
  statusCode: HTTP_CODE,
  object: any
): APIGatewayProxyResult => {
  const response = {
    statusCode,
    body: JSON.stringify(object),
  };
  addCorsHeader(response);
  return response;
};

export const FUNCTION_NAME = 'emi_chat_gpt_lambda';
export const HANDLER = 'handler';
export const CHAT_GPT_EMI_API = 'chat_gpt_handler_api';
export const CHAT = 'chat';
export enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
}
