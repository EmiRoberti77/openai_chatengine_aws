import { handler } from '../src/lambdas/chatgpt/handler';
import { HTTP_METHOD } from '../src/util';

const testChatLambda = async (): Promise<void> => {
  const param = {
    httpMethod: HTTP_METHOD.POST,
    body: JSON.stringify({
      text: '2+2?',
    }),
  };

  const response = await handler(param as any);
  console.log(response);
};

testChatLambda();
