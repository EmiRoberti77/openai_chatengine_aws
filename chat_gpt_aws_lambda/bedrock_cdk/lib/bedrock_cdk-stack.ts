import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { existsSync } from 'fs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Cors, ResourceOptions } from 'aws-cdk-lib/aws-apigateway';
import { BEDROCK_API_NAME, BEDROCK_LAMBDA_NAME, HTTP_METHOD } from './util';

export class BedrockCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaPath = join(__dirname, '../src/lambda/bedrock/');
    if (!existsSync(lambdaPath)) {
      console.error(lambdaPath, 'NOT FOUND');
      return;
    }
    console.info(lambdaPath, 'DETECTED');

    const bedrockLambda = new lambda.Function(this, BEDROCK_LAMBDA_NAME, {
      functionName: BEDROCK_LAMBDA_NAME,
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'handler.bedrockHandler',
      code: lambda.Code.fromAsset(lambdaPath),
    });

    const api = new apigateway.RestApi(this, BEDROCK_API_NAME);

    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    };

    const lambdaIntegration = new apigateway.LambdaIntegration(bedrockLambda);

    const resources = api.root.addResource('bedrock', optionsWithCors);
    resources.addMethod(HTTP_METHOD.GET, lambdaIntegration);
    resources.addMethod(HTTP_METHOD.POST, lambdaIntegration);
  }
}
