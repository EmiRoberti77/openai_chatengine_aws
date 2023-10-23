interface AWSConfig {
  Auth: {
    region: string;
    userPoolId: string;
    userPoolWebClientId: string;
    oauth: {
      domain: string;
      redirectSignIn: string;
      redirectSignOut: string;
      responseType: 'code' | 'token';
    };
  };
}
const awsConfig: AWSConfig = {
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_5DbxH8cGd',
    userPoolWebClientId: '2r0c56lt6kebit8ihicvrda36l',
    oauth: {
      domain: 'https://emiopenai.auth.us-east-1.amazoncognito.com',
      redirectSignIn: 'http://localhost:3000/',
      redirectSignOut: 'http://localhost:3000',
      responseType: 'token',
    },
  },
};

export default awsConfig;
