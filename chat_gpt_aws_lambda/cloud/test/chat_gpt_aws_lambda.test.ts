import { handler } from '../src/lambdas/chatgpt/handler';
import { HTTP_METHOD } from '../src/util';

const testChatLambda = async (): Promise<void> => {
  const param = {
    httpMethod: HTTP_METHOD.POST,
    body: JSON.stringify({
      text: 'what is 2+2+3=?',
    }),
  };

  const response = await handler(param as any);
  console.log(response);
};

testChatLambda();
