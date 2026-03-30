import type { FormEvent } from "react";
import { useState } from "react";
import { useChatSSE } from "../../hooks/useChatSSE";
import { useScrollToBottom } from "../../hooks/useScrollToBottom";
import { formatDateTime } from "../../utils/formatters";

const ChatPage = () => {
  const [input, setInput] = useState("");
  const { messages, isLoading, error, sendMessage } = useChatSSE();
  const bottomRef = useScrollToBottom(messages);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = input;
    setInput("");
    await sendMessage(prompt);
  };

  return (
    <section>
      <h2>Chat</h2>
      <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
        <div
          style={{
            border: "1px solid #d6d3d1",
            borderRadius: "12px",
            padding: "16px",
            minHeight: "320px",
          }}
        >
          {messages.map((message) => (
            <article key={message.id} style={{ marginBottom: "10px" }}>
              <strong>{message.sender}</strong>
              <p style={{ margin: "4px 0" }}>{message.content || "..."}</p>
              <small>{formatDateTime(message.createdAt)}</small>
            </article>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            style={{ flex: 1, padding: "10px 12px" }}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Đang gửi..." : "Gửi"}
          </button>
        </form>

        {error && <p style={{ color: "#b91c1c", margin: 0 }}>{error}</p>}
      </div>
    </section>
  );
};

export default ChatPage;
