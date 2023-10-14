import { handler } from '../src/lambdas/chatgpt/handler';
import { HTTP_METHOD } from '../src/util';

const testChatLambda = async (): Promise<void> => {
  const param = {
    httpMethod: HTTP_METHOD.POST,
    body: JSON.stringify({
      input: 'what is 2+2+3=?',
      username: 'unit test',
    }),
  };

  const response = await handler(param as any);
  console.log(response);
};

testChatLambda();
