import { fetchEventSource } from "@microsoft/fetch-event-source";
import type { ChatRequest, ChatStreamChunk } from "../types/chat.types";
import { apiConfig } from "./api";

export interface StreamCallbacks {
  onChunk: (chunk: ChatStreamChunk) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

export const streamChat = async (
  payload: ChatRequest,
  callbacks: StreamCallbacks,
): Promise<void> => {
  await fetchEventSource(`${apiConfig.baseUrl}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    onmessage(event) {
      if (!event.data) {
        return;
      }

      if (event.data === "[DONE]") {
        callbacks.onDone();
        return;
      }

      try {
        const data = JSON.parse(event.data) as Partial<ChatStreamChunk>;

        console.log("Received SSE chunk:", data);

        if (!data.type) { 
          callbacks.onChunk({ type: "message", content: event.data });
          return;
        }

        if (data.type === "done") {
          callbacks.onDone();
          return;
        }

        if (data.type === "error") {
          callbacks.onError(data.error ?? "Unknown SSE error");
          return;
        }

        callbacks.onChunk(data as ChatStreamChunk);
      } catch {
        callbacks.onChunk({ type: "message", content: event.data });
      }
    },
    onclose() {
      callbacks.onDone();
    },
    onerror(err) {
      callbacks.onError(
        err instanceof Error ? err.message : "SSE connection error",
      );
      throw err;
    },
  });
};
