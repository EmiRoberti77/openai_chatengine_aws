import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';
import { existsSync } from 'fs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { BucketParams } from './util';

export class ChatGptUIClient extends Stack {
  public bucketName: string = 'chat_gpt_ui_client-bucket';
  public bucketArn: string = `arn:aws:s3:::${this.bucketName}`;
  private uiPath: string;
  private uiApplicationBucket: Bucket;
  private distribution: Distribution;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    if (this.buildUiPath()) this.init();
  }

  buildUiPath(): boolean {
    this.uiPath = join(__dirname, '..', '..', 'client', 'build');
    if (existsSync(this.uiPath)) {
      console.log('FOUND UI PATH', this.uiPath);
      return true;
    } else {
      console.log('NOT FOUND UI PATH', this.uiPath);
      return false;
    }
  }

  init() {
    this.uiApplicationBucket = new Bucket(
      this,
      BucketParams.uiApplicationBucket
    );
    this.bucketName = this.uiApplicationBucket.bucketName;
    this.bucketArn = this.uiApplicationBucket.bucketArn;

    new BucketDeployment(this, BucketParams.uiDeploymentBucket, {
      destinationBucket: this.uiApplicationBucket,
      sources: [Source.asset(this.uiPath)],
    });

    const originIdentity = new OriginAccessIdentity(
      this,
      'chat_gpt_app_origin_access_identity'
    );
    this.uiApplicationBucket.grantRead(originIdentity);
    this.distribution = new Distribution(this, BucketParams.uiDistribution, {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(this.uiApplicationBucket, {
          originAccessIdentity: originIdentity,
        }),
      },
    });

    this.printOutputs();
  }

  printOutputs() {
    new CfnOutput(this, 'BucketName', {
      value: this.bucketName,
    });
    new CfnOutput(this, 'BucketArn', {
      value: this.bucketName,
    });
    new CfnOutput(this, 'deployment', {
      value: this.distribution.distributionDomainName,
    });
  }
}
