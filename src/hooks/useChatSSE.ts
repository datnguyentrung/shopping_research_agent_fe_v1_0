import { useCallback, useRef, useState } from "react";
import { streamChat } from "../services/chatService";
import type {
  ChatMessage,
  ChatRequest,
  ChatStreamChunk,
} from "../types/chat.types";
import { normalizeA2UIPayload } from "../utils/a2ui";

const createMessage = (
  role: ChatMessage["role"],
  content: string,
): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
  createdAt: new Date().toISOString(),
});

export const useChatSSE = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());

  const applyChunkToAssistant = useCallback(
    (assistantMessageId: string, chunk: ChatStreamChunk) => {
      setMessages((prev) =>
        prev.map((item) => {
          if (item.id !== assistantMessageId) {
            return item;
          }

          if (chunk.type === "message") {
            return {
              ...item,
              content: `${item.content}${chunk.content ?? ""}`,
            };
          }

          if (chunk.type === "a2ui") {
            const rawPayload = chunk.a2ui ?? chunk.a2Ui;
            const normalizedPayload = normalizeA2UIPayload(rawPayload);
            if (!normalizedPayload) {
              return item;
            }

            return {
              ...item,
              a2ui: normalizedPayload,
            };
          }

          return item;
        }),
      );
    },
    [],
  );

  const startStream = useCallback(
    async (
      payload: ChatRequest,
      options?: {
        userMessage?: string;
        isHidden?: boolean;
      },
    ) => {
      const assistantMessageId = crypto.randomUUID();

      setError(null);
      setIsLoading(true);
      setMessages((prev) => {
        const next = [...prev];

        if (
          options?.userMessage &&
          options.userMessage.trim() &&
          !options.isHidden
        ) {
          next.push(createMessage("user", options.userMessage));
        }

        next.push({
          id: assistantMessageId,
          role: "assistant",
          content: "",
          createdAt: new Date().toISOString(),
        });

        return next;
      });

      try {
        await streamChat(
          { ...payload, sessionId: sessionIdRef.current },
          {
            onChunk: (chunk) => {
              applyChunkToAssistant(assistantMessageId, chunk);
            },
            onDone: () => {
              setIsLoading(false);
            },
            onError: (errMessage) => {
              setError(errMessage);
              setIsLoading(false);
            },
          },
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Cannot connect to chat service",
        );
        setIsLoading(false);
      }
    },
    [applyChunkToAssistant],
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) {
        return;
      }

      await startStream({ message }, { userMessage: message });
    },
    [startStream],
  );

  const sendHiddenMessage = useCallback(
    async (action: string, payload: unknown) => {
      await startStream({
        message: "",
        hidden_events: {
          action,
          payload,
        },
      }, { isHidden: true});
    },
    [startStream],
  );

  const resetChat = useCallback(() => {
    // Tạo 1 Session ID mới hoàn toàn
    sessionIdRef.current = crypto.randomUUID();
    // Xóa lịch sử UI
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    sendHiddenMessage,
    resetChat,
  };
};
