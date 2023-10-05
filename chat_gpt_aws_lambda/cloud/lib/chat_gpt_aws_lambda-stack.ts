import * as cdk from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import {
  CHAT,
  CHAT_GPT_EMI_API,
  FUNCTION_NAME,
  HANDLER,
  HTTP_METHOD,
} from '../src/util';
import { join } from 'path';
import { existsSync } from 'fs';
import {
  Cors,
  LambdaIntegration,
  ResourceOptions,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';

export class ChatGptAwsLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const path = join(
      __dirname,
      '..',
      'src',
      'lambdas',
      'chatgpt',
      'handler.ts'
    );
    if (!existsSync(path)) {
      console.error('NOT FOUND', path);
      return;
    }

    const chatgptLambda = new NodejsFunction(this, FUNCTION_NAME, {
      runtime: Runtime.NODEJS_18_X,
      functionName: FUNCTION_NAME,
      handler: HANDLER,
      entry: path,
    });

    const api = new RestApi(this, CHAT_GPT_EMI_API);

    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    };

    const apiResources = api.root.addResource(CHAT, optionsWithCors);
    const lambdaIntegration = new LambdaIntegration(chatgptLambda);
    apiResources.addMethod(HTTP_METHOD.GET, lambdaIntegration);
    apiResources.addMethod(HTTP_METHOD.POST, lambdaIntegration);
  }
}
