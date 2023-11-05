import { handler } from '../src/lambdas/handler';
import { HTTP_METHOD } from '../src/util';

const testChatLambda = async (): Promise<void> => {
  const param = {
    httpMethod: HTTP_METHOD.GET,
    queryStringParameters: {
      username: 'emi_cod',
    },
  };

  const response = await handler(param as any);
  console.log(response);
};

testChatLambda();
