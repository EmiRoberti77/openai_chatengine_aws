import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { DYNAMO_TABLES } from '../../util';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { ChatQueryParam } from '../chatgpt/ChatQueryParam';

export class ChatGptQueryHandler {
  private dbClient: DynamoDBClient;
  private query: ChatQueryParam | undefined;

  constructor(query?: ChatQueryParam) {
    this.dbClient = new DynamoDBClient({});
    this.query = query || undefined;
  }

  public async scan(limit: number): Promise<any> {
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

  public async getQuery(username: string, limit: number = 10): Promise<any> {
    console.log('username', username);
    const params = {
      TableName: DYNAMO_TABLES.USER_QUERIES,
      IndexName: 'userNameDateIndex',
      KeyConditionExpression: 'username = :usernameValue',
      ExpressionAttributeValues: {
        ':usernameValue': {
          S: username,
        },
      },
      ScanIndexForward: false,
      Limit: limit,
    };

    try {
      const response = await this.dbClient.send(new QueryCommand(params));
      if (!response.Items) return [];
      console.log(response.Items);
      return response.Items.map((row) => unmarshall(row));
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
