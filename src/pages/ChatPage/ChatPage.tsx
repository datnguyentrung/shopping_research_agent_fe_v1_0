import type { FormEvent } from "react";
import { useState } from "react";
import { useChatSSE } from "../../hooks/useChatSSE";
import { useScrollToBottom } from "../../hooks/useScrollToBottom";
import { formatDateTime } from "../../utils/formatters";
import "./ChatPage.scss";
import { A2UIRenderer } from "./Renderer";

const ChatPage = () => {
  const [input, setInput] = useState("");
  const { messages, isLoading, error, sendMessage, sendHiddenMessage } =
    useChatSSE();
  const bottomRef = useScrollToBottom(messages);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = input;
    setInput("");
    await sendMessage(prompt);
  };

  return (
    <section className="chat-page">
      <h2>Chat</h2>
      <div className="chat-page__content">
        <div className="chat-page__messages">
          {messages.map((message) => (
            <article key={message.id} className="chat-page__message-item">
              <strong>{message.role}</strong>
              <p className="chat-page__message-content">
                {message.content || (message.a2ui ? "" : "...")}
              </p>
              {message.a2ui ? (
                <div className="chat-page__a2ui">
                  <A2UIRenderer
                    a2uiPayload={message.a2ui}
                    onSendHiddenMessage={sendHiddenMessage}
                  />
                </div>
              ) : null}
              <small>{formatDateTime(message.createdAt)}</small>
            </article>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="chat-page__form">
          <input
            className="chat-page__input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Đang gửi..." : "Gửi"}
          </button>
        </form>

        {error && <p className="chat-page__error">{error}</p>}
      </div>
    </section>
  );
};

export default ChatPage;
