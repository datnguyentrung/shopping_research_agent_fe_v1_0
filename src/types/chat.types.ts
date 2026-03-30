export type Sender = "user" | "assistant" | "system";

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  content: string;
  createdAt: string;
  products?: Product[];
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatStreamChunk {
  type: "message" | "done" | "error";
  content?: string;
  error?: string;
}
