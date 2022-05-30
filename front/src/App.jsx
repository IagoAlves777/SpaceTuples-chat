import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { useContext, useEffect, useState } from "react";
import { ChatList } from "./pages/chatList";
import { Chat } from "./components/chat";
import { useId } from "./context/IdContext";
import { useChat } from "./context/chatContext";

const socket = io("http://localhost:8080", {
  transports: ["websocket"],
});

const App = () => {
  const { id, setId } = useId();
  const { chat, setChat } = useChat();
  const navigate = useNavigate();
  const [nick, setNick] = useState("");
  const [user, setUser] = useState("");
  const [nameChat, setNameChat] = useState("");
  const [chats, setChats] = useState([]);
  const [messages, updateMessages] = useState([{}]);
  const localStorageList = [];
  for (var i = 0; i < localStorage.length; i++) {
    localStorageList.push(localStorage.key(i));
  }
  const haveTheKey = localStorageList.filter(function (item) {
    return item === "sala";
  });

  const conectar = (nick) => {
    setNick("");
    socket.emit("newUser", {
      name: nick,
    });
    navigate("/chatList");
  };

  const newSala = (sala) => {
    setNameChat("");
    socket.emit("newSala", {
      sala: sala,
    });
  };

  const entrarSala = (salaId, user) => {
    if (haveTheKey.length > 0) {
      const localSala = localStorage.getItem("sala");
      if (localSala === "") {
        localStorage.setItem("sala", salaId);
      }
    }

    if (!(haveTheKey.length > 0)) {
      localStorage.setItem("sala", salaId);
    }
    socket.emit("entrarSala", {
      salaId: salaId,
      user: user,
    });
  };

  useEffect(() => {
    socket.on("newSala", (data) => {
      setChats(data);
    });
    socket.on("getSalas", (data) => {
      setChats(data);
    });

    socket.on("newUser", (data) => {
      if (user === "") {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
      }
    });

    socket.on("entrarSala", (data) => {
      const localUser = JSON.parse(localStorage.getItem("user"));
      if (localUser.id === data.id) {
        const localSala = localStorage.getItem("sala");
        console.log(
          "🚀 ~ file: App.jsx ~ line 83 ~ socket.on ~ localSala",
          localSala
        );
        setUser(data);
      }
    });

    socket.on("usersSala", (data) => {
      const localSala = localStorage.getItem("sala");
      if (localSala == data[0].id) {
        setChat(data);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.emit("getSalas", {});
    const _id = id;
    socket.emit("getChat", {
      id: _id,
    });
  }, [id]);

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage nick={nick} setNick={setNick} conectar={conectar} />}
      />
      <Route
        path="/chatList"
        element={
          <ChatList
            nameChat={nameChat}
            setNameChat={setNameChat}
            newSala={newSala}
            chats={chats}
            setChats={setChats}
            entrarSala={entrarSala}
            user={user}
          />
        }
      />
      <Route
        path="/chatList/chat/:chatId"
        element={<Chat messages={messages} updateMessages={updateMessages} />}
      />
    </Routes>
  );
};

export default App;
