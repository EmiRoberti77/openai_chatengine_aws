import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HTTP_CODE, jsonApiProxyResultResponse } from '../../util';
import axios, { AxiosResponse } from 'axios';

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

    try {
      const response: AxiosResponse = await axios.post(ENDPOINT, body);

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
