import { useEffect, useRef } from "react";
import type { ChatMessage } from "../types/chat.types";

export const useScrollToBottom = (messages: ChatMessage[]) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Kích hoạt scroll mượt mà mỗi khi mảng messages thay đổi (nhận chunk mới)
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end", // Cuộn cạnh dưới của element vào màn hình
      });
    }
  }, [messages]); // Dependency cực kỳ quan trọng

  return bottomRef;
};
