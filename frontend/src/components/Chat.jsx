import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { Send } from "lucide-react";

const Chat = ({ lobbyId }) => {
  const {
    messages,
    sendMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
    getMessages,
  } = useChatStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getMessages(lobbyId);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [lobbyId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === "") return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="chat-box p-4 rounded flex flex-col h-full">
      <div className="messages flex-1 overflow-y-auto mb-5">
        {messages.map((msg, i) => (
          <div key={i} className="mb-3 text-2xl text-wrap">
            <span className="font-bold text-xl">
              {msg.sender?.name}:{" "}
            </span>
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          className="input input-bordered flex-[0.8]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="btn flex-[0.2] bg-base-300 rounded-box">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
