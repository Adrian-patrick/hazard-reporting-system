// components/Chatbot.tsx
import React, { useState } from "react";
import axios from "axios";

const Chatbot: React.FC = () => {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState<{ role: string; message: string }[]>([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setChatLog((prev) => [...prev, { role: "user", message: input }]);

    try {
      const res = await axios.post("http://localhost:8000/chat/", { message: input });
      setChatLog((prev) => [...prev, { role: "bot", message: res.data.response }]);
    } catch (err) {
      setChatLog((prev) => [
        ...prev,
        { role: "bot", message: "❌ Failed to get response from chatbot." },
      ]);
    }

    setInput("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto shadow-lg rounded-lg bg-white">
      <h2 className="text-lg font-semibold mb-2">💬 Hazard Chatbot Assistant</h2>
      <div className="h-64 overflow-y-auto border p-2 mb-2 rounded">
        {chatLog.map((entry, idx) => (
          <div key={idx} className={`mb-1 ${entry.role === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                entry.role === "user" ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              {entry.message}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border px-3 py-2 rounded"
          placeholder="Ask about hazards..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
