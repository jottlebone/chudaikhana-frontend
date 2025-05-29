// File: src/main.jsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function App() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (joined) {
      const socket = new WebSocket(BACKEND_URL.replace(/^http/, "ws"));
      socket.onopen = () => {
        socket.send(JSON.stringify({ type: "join", username }));
      };
      socket.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.type === "message") {
          setMessages((m) => [...m, data]);
        }
      };
      setWs(socket);
      return () => socket.close();
    }
  }, [joined, username]);

  const sendMessage = () => {
    if (ws && input.trim()) {
      ws.send(JSON.stringify({ type: "message", username, text: input }));
      setInput("");
    }
  };

  if (!joined) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Enter your nickname</h2>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nickname"
        />
        <button onClick={() => username.trim() && setJoined(true)}>
          Join Chat
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>CHuDAI KHAAna Chat</h2>
      <div
        style={{
          border: "1px solid #ccc",
          height: 300,
          overflowY: "scroll",
          padding: 10,
          marginBottom: 10,
        }}
      >
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.username}</b>: {m.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "80%" }}
      />
      <button onClick={sendMessage} style={{ width: "18%" }}>
        Send
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
