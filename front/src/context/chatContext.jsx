import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export default function idProvider({ children }) {
  const [chat, setChat] = useState([]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        setChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  const { chat, setChat } = context;
  return { chat, setChat };
}
