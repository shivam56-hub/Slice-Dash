import React, { useEffect, useRef } from "react";
import { useState } from "react";
import "../styles/AI-Services.css";
import ChatTyping from "../loaders/ChatTyping";

export default function AIChatbot() {
  const [IsOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const currentText = message;
    const userMessage = { role: "user", content: currentText };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);


    try {
      // `${import.meta.env.VITE_API_URL}
      // const response = await fetch("http://127.0.0.1:8000/api/chat", {
        const response = await fetch(`${import.meta.env.VITE_AI_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentText,
          history: messages,
          token: localStorage.getItem("token"),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
    

      const aiMessage = {
        role: "assistant",
        content: data.response,
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="widget-wrapper">
      {/* toggle button */}
      <button
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!IsOpen)}
        aria-label="Toggle Chat"
      >
        {IsOpen ? "✕" : "💬"}
      </button>
      {IsOpen && (
        <div className="services-section">
          <div className="services">
            <div className="header">
              <h2>Pizza AI Assistant</h2>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>
            <div className="chat-body">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                  <strong>{msg.role === "user" ? "You" : "PizzaBot"}</strong>
                  <p>{msg.content}</p>
                </div>
              ))}
              {loading && <span className="loading-text">AI is thinking<ChatTyping /></span>}
              <div ref={chatEndRef} />
            </div>
            <div className="input-section">
              <input
                type="text"
                placeholder="Ask me Anything"
                value={message}
                disabled={loading}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage} className="service-btn" disabled={loading}>
                Ask
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
