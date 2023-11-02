#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ChatGptAwsLambdaStack } from '../lib/chat_gpt_aws_lambda-stack';
import { ChatGptUIClient } from '../lib/chat_gpt_ui_client';

const app = new cdk.App();
new ChatGptAwsLambdaStack(app, 'ChatGptAwsLambdaStack', {});
new ChatGptUIClient(app, 'ChatGptUIClient');
