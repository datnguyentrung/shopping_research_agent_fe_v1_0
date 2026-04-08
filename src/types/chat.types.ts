import type { A2UIPayload } from "./a2ui.types";
import type { CapturedData } from "./product.types";

export type Role = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
  products?: CapturedData[]; // Thêm trường products để chứa thông tin sản phẩm liên quan đến tin nhắn, nếu có
  a2ui?: A2UIPayload; // Thêm trường a2ui để chứa payload đặc biệt cho giao diện, nếu có
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  hidden_events?: {
    action: string;
    payload: unknown;
  };
}

export interface ChatStreamChunk {
  type: "message" | "a2ui" | "done" | "error";
  content?: string;
  a2ui?: unknown;
  a2Ui?: unknown; // Hỗ trợ cả 2 kiểu a2ui và a2Ui để đảm bảo tính tương thích
  error?: string;
}
