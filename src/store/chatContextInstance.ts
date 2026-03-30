import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";
import type { ChatMessage } from "../types/chat.types";

export interface ChatContextValue {
  sharedMessages: ChatMessage[];
  setSharedMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

export const ChatContext = createContext<ChatContextValue | undefined>(
  undefined,
);
