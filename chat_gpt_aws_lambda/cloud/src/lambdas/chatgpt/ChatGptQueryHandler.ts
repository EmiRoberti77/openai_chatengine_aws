import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { DYNAMO_TABLES } from '../../util';
import { marshall } from '@aws-sdk/util-dynamodb';
import { randomUUID } from 'crypto';
import { ChatQueryParam } from './ChatQueryParam';
export class ChatGptQueryHandler {
  private dbClient: DynamoDBClient;
  private query: ChatQueryParam;

  constructor(query: ChatQueryParam) {
    this.dbClient = new DynamoDBClient({});
    this.query = query;
  }

  public async saveQuery(): Promise<boolean> {
    const params = {
      TableName: DYNAMO_TABLES.USER_QUERIES,
      Item: marshall(this.query),
    };

    try {
      await this.dbClient.send(new PutItemCommand(params));
      console.info('saved ', JSON.stringify(this.query, null, 2));
    } catch (error: any) {
      console.error(error.message);
      return false;
    }

    return true;
  }
}
