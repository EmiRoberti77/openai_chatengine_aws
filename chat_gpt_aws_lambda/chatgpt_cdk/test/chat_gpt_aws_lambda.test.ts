import { handler } from '../src/lambdas/handler';
import { HTTP_METHOD, allModels } from '../src/util';

const testChatLambda = async (): Promise<void> => {
  const param = {
    httpMethod: HTTP_METHOD.POST,
    body: JSON.stringify({
      input: 'what is 2+2+3=?',
      username: 'emi_code',
      engine: allModels[1],
    }),
  };

  const response = await handler(param as any);
  console.log(response);
};

testChatLambda();
