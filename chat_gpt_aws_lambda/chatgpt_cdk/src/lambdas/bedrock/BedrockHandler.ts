import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HTTP_CODE, jsonApiProxyResultResponse } from '../../util';
// import {
//   BedrockRuntimeClient,
//   InvokeModelWithResponseStreamCommand,
// } from '@aws-sdk/client-bedrock-runtime';

export class BedrockHandler {
  private event: APIGatewayProxyEvent;
  //private bedrockRuntime = new BedrockRuntimeClient({});
  private prompt = 'create a story about a planet called Foo';
  private params = {
    modelId: 'anthropic.claude-v2',
    contentType: 'application/json',
    accept: '*/*',
    body: JSON.stringify({
      prompt: `Human: ${this.prompt}\nAssistant:`,
      max_tokens_to_sample: 300,
      temperature: 1,
      top_k: 250,
      top_p: 0.999,
      stop_sequences: ['\n\nHuman:'],
      anthropic_version: 'bedrock-2023-05-31',
    }),
  };

  constructor(event: APIGatewayProxyEvent) {
    this.event = event;
  }

  public async post(): Promise<APIGatewayProxyResult> {
    try {
      //const command = new InvokeModelWithResponseStreamCommand(this.params);
      //const response = await this.bedrockRuntime.send(command);

      // if (response.Payload && response.Payload.byteLength > 0) {
      //   const text = new TextDecoder().decode(response.Payload);
      //   const parsedResponse = JSON.parse(text);

      //   // Process the parsed response here
      //   console.log(parsedResponse.completion);
      //   return jsonApiProxyResultResponse(HTTP_CODE.OK, {
      //     message: true,
      //     body: parsedResponse.completion,
      //   });
      // }

      return jsonApiProxyResultResponse(HTTP_CODE.OK, {
        message: true,
        body: 'bedrock response',
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
