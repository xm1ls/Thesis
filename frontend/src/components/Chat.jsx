import { useState } from "react";
import { useChatStore } from "../store/chatStore";

const Chat = () => {
  const [message, setMessage] = useState("");

  const { sendMessage } = useChatStore();

  return (
    <div>
      <input
        type="text"
        placeholder="Type here"
        className="input"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />

      <button className="btn" onClick={() => sendMessage(message)}>Send</button>
    </div>
  );
};

export default Chat;
