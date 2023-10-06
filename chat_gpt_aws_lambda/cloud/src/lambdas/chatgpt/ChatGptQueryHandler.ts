import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { DYNAMO_TABLES } from '../../util';
import { marshall } from '@aws-sdk/util-dynamodb';
import { randomUUID } from 'crypto';

export class ChatGptQueryHandler {
  private dbClient: DynamoDBClient;
  private query: any;

  constructor(query: any) {
    this.dbClient = new DynamoDBClient({});
    this.query = query;
  }

  public async saveQuery(): Promise<boolean> {
    const params = {
      TableName: DYNAMO_TABLES.USER_QUERIES,
      Item: marshall({ id: randomUUID(), query: this.query }),
    };

    try {
      await this.dbClient.send(new PutItemCommand(params));
    } catch (error: any) {
      console.error(error.message);
      return false;
    }

    return true;
  }
}
