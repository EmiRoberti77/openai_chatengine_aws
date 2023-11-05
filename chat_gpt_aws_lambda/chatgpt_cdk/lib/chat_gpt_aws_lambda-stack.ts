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
  LambdaIntegration,
  ResourceOptions,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as secrets from 'aws-cdk-lib/aws-secretsmanager';

export class ChatGptAwsLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const path = join(__dirname, '..', 'src', 'lambdas', 'handler.ts');
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

    table.addGlobalSecondaryIndex({
      indexName: 'userNameDateIndex',
      partitionKey: {
        name: 'username',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: AttributeType.NUMBER,
      },

      projectionType: ProjectionType.ALL,
    });

    //get secret key for CHAT GPT Key
    const secret = secrets.Secret.fromSecretNameV2(
      this,
      'chat_gpt_api_key',
      'chat_gpt_api_key'
    );

    //create lambda
    const chatgptLambda = new NodejsFunction(this, FUNCTION_NAME, {
      runtime: Runtime.NODEJS_18_X,
      functionName: FUNCTION_NAME,
      handler: HANDLER,
      entry: path,
      timeout: cdk.Duration.seconds(20),
      environment: {
        USER_QUERY_TABLE: DYNAMO_TABLES.USER_QUERIES,
        CHAT_OPEN_AI_KEY: secret.secretName,
      },
    });

    chatgptLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [
          table.tableArn,
          'arn:aws:ssm:us-east-1:432599188850:parameter/chat_gpt_api_key',
          `${table.tableArn}/index/userNameDateIndex`,
        ],
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
