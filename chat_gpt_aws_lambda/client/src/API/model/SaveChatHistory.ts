export interface SavedChatHistory {
  createdAt: string;
  username: string;
  userInput: UserInput;
  id: string;
  engine: string;
  chatCompletion: ChatCompletion;
}

export interface UserInput {
  user: string;
  input: string;
  role: string;
}

export interface ChatCompletion {
  model: string;
  id: string;
  choices: Choice[];
  created: number;
  object: string;
  usage: Usage;
}

export interface Choice {
  message: Message;
  index: number;
  finish_reason: string;
}

export interface Message {
  content: string;
  role: string;
}

export interface Usage {
  total_tokens: number;
  completion_tokens: number;
  prompt_tokens: number;
}
