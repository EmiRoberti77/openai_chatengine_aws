export interface UserInput {
  role: 'system' | 'assistant' | 'user' | 'function';
  user: string;
  input: string;
}

export interface ChatQueryParam {
  id: string;
  createdAt: string;
  chatCompletion: any; //this is the ChatGPT return
  userInput: UserInput;
}
