import React from "react";

export default function ChatbotIframe( ) {
  return (
    <iframe
      src={`${window.location.origin}/widget/`}
      title="Chatbot Widget"
      style={{
        width: "400px",
        height: "600px",
        border: "none",
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
      }}
      allow="clipboard-write"
    />
  );
}
