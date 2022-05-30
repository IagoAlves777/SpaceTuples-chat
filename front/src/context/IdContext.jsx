import React, { createContext, useContext, useState } from "react";

const IdContext = createContext();

export default function idProvider({ children }) {
  const [id, setId] = useState("");

  return (
    <IdContext.Provider
      value={{
        id,
        setId,
      }}
    >
      {children}
    </IdContext.Provider>
  );
}

export function useId() {
  const context = useContext(IdContext);
  const { id, setId } = context;
  return { id, setId };
}
