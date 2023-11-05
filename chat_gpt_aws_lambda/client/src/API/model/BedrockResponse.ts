export interface BedrockResponse {
  prompt: Prompt;
  completions: Completion[];
  id: number;
}

export interface Prompt {
  tokens: Token[];
  text: string;
}

export interface Token {
  textRange: TextRange;
  generatedToken: GeneratedToken;
  topTokens: any;
}

export interface TextRange {
  start: number;
  end: number;
}

export interface GeneratedToken {
  logprob: number;
  token: string;
  raw_logprob: number;
}

export interface Completion {
  data: Data;
  finishReason: FinishReason;
}

export interface Data {
  tokens: Token2[];
  text: string;
}

export interface Token2 {
  textRange: TextRange2;
  generatedToken: GeneratedToken2;
  topTokens: any;
}

export interface TextRange2 {
  start: number;
  end: number;
}

export interface GeneratedToken2 {
  logprob: number;
  token: string;
  raw_logprob: number;
}

export interface FinishReason {
  reason: string;
}
