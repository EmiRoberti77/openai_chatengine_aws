import { UsageToken } from './Usage';

export interface ChatHistory {
  user: string;
  createdAt: string;
  input: string;
  content: string;
  role: string;
  usage: UsageToken;
  engine: string;
}
