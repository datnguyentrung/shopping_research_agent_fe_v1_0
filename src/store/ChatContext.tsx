import type { PropsWithChildren } from "react";
import { useMemo, useState } from "react";
import type { ChatMessage } from "../types/chat.types";
import { ChatContext } from "./chatContextInstance";

export const ChatProvider = ({ children }: PropsWithChildren) => {
  const [sharedMessages, setSharedMessages] = useState<ChatMessage[]>([]);

  const value = useMemo(
    () => ({
      sharedMessages,
      setSharedMessages,
    }),
    [sharedMessages],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
