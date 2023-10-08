import * as cdk from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import {
  CHAT,
  CHAT_GPT_EMI_API,
  DYNAMO_TABLES,
  FUNCTION_NAME,
  HANDLER,
  HTTP_METHOD,
} from '../src/util';
import { join } from 'path';
import { existsSync } from 'fs';
import {
  Cors,
  Deployment,
  LambdaIntegration,
  ResourceOptions,
  RestApi,
  Stage,
} from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { API_KEY } from '../src/lambdas/chatgpt/Config';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ApiGateway } from 'aws-cdk-lib/aws-events-targets';

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
    //create table
    const table = new Table(this, DYNAMO_TABLES.USER_QUERIES, {
      tableName: DYNAMO_TABLES.USER_QUERIES,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
    });

    const chatgptLambda = new NodejsFunction(this, FUNCTION_NAME, {
      runtime: Runtime.NODEJS_18_X,
      functionName: FUNCTION_NAME,
      handler: HANDLER,
      entry: path,
      timeout: cdk.Duration.seconds(20),
      environment: {
        USER_QUERY_TABLE: DYNAMO_TABLES.USER_QUERIES,
        OPEN_AI_KEY: API_KEY,
      },
    });

    chatgptLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [table.tableArn],
        actions: ['*'],
      })
    );

    const api = new RestApi(this, CHAT_GPT_EMI_API);

    // const deployment = new Deployment(this, 'Deployment', { api: api });
    // const stage = new Stage(this, 'Stage', {
    //   stageName: 'prod',
    //   deployment,
    // });

    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    };

    const apiKey = api.addApiKey('emi_demo_key_1977');

    const plan = api.addUsagePlan('emiChatGPTusagePlan', {
      name: 'emiChatGPTusagePlan',
      throttle: {
        rateLimit: 10,
        burstLimit: 20,
      },
    });

    plan.addApiKey(apiKey); // Associate the API key with the usage plan

    // plan.addApiStage({
    //   stage,
    // });

    const apiResources = api.root.addResource(CHAT, optionsWithCors);
    const lambdaIntegration = new LambdaIntegration(chatgptLambda);

    apiResources.addMethod(HTTP_METHOD.GET, lambdaIntegration, {
      apiKeyRequired: true,
    });
    apiResources.addMethod(HTTP_METHOD.POST, lambdaIntegration, {
      apiKeyRequired: true,
    });
  }
}
