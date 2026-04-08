import type { FormEvent } from "react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChatSSE } from "../../hooks/useChatSSE";
import { useScrollToBottom } from "../../hooks/useScrollToBottom";
import { formatDateTime } from "../../utils/formatters";
import "./ChatPage.scss";
import { A2UIRenderer } from "./Renderer";

const ChatPage = () => {
  const [input, setInput] = useState("");
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    sendHiddenMessage,
    resetChat,
  } = useChatSSE();
  const bottomRef = useScrollToBottom(messages);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = input;
    setInput("");
    await sendMessage(prompt);
  };

  return (
    <section className="chat-page">
      <div className="chat-page__header">
        <h2>Shopping Research Agent</h2>
        <button onClick={resetChat} className="btn-reset" disabled={isLoading}>
          🔄 Bắt đầu mới
        </button>
      </div>
      <div className="chat-page__content">
        <div className="chat-page__messages">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`chat-page__message-item ${message.role}`}
            >
              <strong>{message.role === "user" ? "Bạn" : "Agent"}</strong>

              {/* FIX: Render Markdown thay vì text thô */}
              {message.content && (
                <div className="chat-page__message-content markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}

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
            placeholder="Nhập nhu cầu mua sắm của bạn (VD: Tìm áo thun nam oversize...)"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? "Đang gửi..." : "Gửi"}
          </button>
        </form>

        {error && <p className="chat-page__error">{error}</p>}
      </div>
    </section>
  );
};

export default ChatPage;
