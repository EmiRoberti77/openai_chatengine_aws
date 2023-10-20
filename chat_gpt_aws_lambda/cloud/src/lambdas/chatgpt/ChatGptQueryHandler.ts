import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { DYNAMO_TABLES } from '../../util';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { ChatQueryParam } from './ChatQueryParam';
import { constrainedMemory } from 'process';
export class ChatGptQueryHandler {
  private dbClient: DynamoDBClient;
  private query: ChatQueryParam | undefined;

  constructor(query?: ChatQueryParam) {
    this.dbClient = new DynamoDBClient({});
    this.query = query || undefined;
  }

  public async getQuery(limit: number): Promise<any> {
    const params = {
      TableName: DYNAMO_TABLES.USER_QUERIES,
    };

    try {
      const response = await this.dbClient.send(new ScanCommand(params));
      if (!response.Items) return [];

      const sorted = response.Items.sort(
        (a: any, b: any) =>
          new Date(b.createdAt.S).getTime() - new Date(a.createdAt.S).getTime()
      );

      const result = [];
      //only return the last x amount];
      for (let i = 0; i < Math.min(limit, sorted.length); i++) {
        result.push(unmarshall(sorted[i]));
      }
      return result;
    } catch (error: any) {
      console.error(error.message);
      return undefined;
    }
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
