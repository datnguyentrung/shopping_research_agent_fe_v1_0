import { useCallback, useState } from "react";
import { streamChat } from "../services/chatService";
import type { ChatMessage } from "../types/chat.types";

const createMessage = (
  sender: ChatMessage["sender"],
  content: string,
): ChatMessage => ({
  id: crypto.randomUUID(),
  sender,
  content,
  createdAt: new Date().toISOString(),
});

export const useChatSSE = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) {
      return;
    }

    const userMessage = createMessage("user", message);
    const assistantMessageId = crypto.randomUUID();

    setError(null);
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: assistantMessageId,
        sender: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      },
    ]);

    try {
      await streamChat(
        { message },
        {
          onChunk: (chunk) => {
            if (chunk.type !== "message") {
              return;
            }

            setMessages((prev) =>
              prev.map((item) =>
                item.id === assistantMessageId
                  ? {
                      ...item,
                      content: `${item.content}${chunk.content ?? ""}`,
                    }
                  : item,
              ),
            );
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
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};
