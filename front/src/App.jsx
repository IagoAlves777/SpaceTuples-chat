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
import { Modal, Button } from "react-bootstrap/";

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
  const [usersOn, setUsersOn] = useState([]);
  const [showError, setShowError] = useState(false);
  const [menssagens, setMenssagens] = useState([]);
  const [privateChats, setPrivateChats] = useState([]);

  const localStorageList = [];
  for (var i = 0; i < localStorage.length; i++) {
    localStorageList.push(localStorage.key(i));
  }
  const haveTheKey = localStorageList.filter(function (item) {
    return item === "sala";
  });

  const conectar = (nick) => {
    socket.emit("newUser", {
      name: nick,
    });
  };

  const newSala = (sala, user) => {
    socket.emit("newSala", {
      sala: sala,
      user: user.id,
    });
  };

  const enviarMenssagem = (menssagem) => {
    socket.emit("newMenssagem", menssagem);
  };

  const atualizarMensagens = () => {
    socket.emit("newMenssagem", "");
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

  const sairSala = (user) => {
    socket.emit("exitSala", {
      user: user,
    });
  };

  useEffect(() => {
    socket.on("newSala", (data) => {
      const localuser = JSON.parse(localStorage.getItem("user"));
      if (data.user === localuser.id) {
        setShowError(true);
      } else {
        setChats(data.tupleSpace);
      }
    });
    socket.on("getSalas", (data) => {
      setChats(data);
    });

    socket.on("newUser", (data) => {
      if (user === "") {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        navigate("/chatList");
      }
    });

    socket.on("entrarSala", (data) => {
      const localUser = JSON.parse(localStorage.getItem("user"));
      if (localUser.id === data.id) {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
      }
    });

    socket.on("usersSala", (data) => {
      const localSala = localStorage.getItem("sala");
      if (localSala == data[0].id) {
        setChat(data);
      }
    });

    socket.on("exitSala", (data) => {
      const localSala = localStorage.getItem("sala");
      if (localSala == data[0].id) {
        if (data[0].usuarios) setUsersOn(data[0].usuarios);
      }
    });

    socket.on("newMenssagem", (menssagens) => {
      const newMenssagens = getMenssagens(menssagens);
      setMenssagens(newMenssagens);
    });
  }, [socket]);

  const getMenssagens = (menssagens) => {
    const localSala = localStorage.getItem("sala");
    const localUser = JSON.parse(localStorage.getItem("user"));
    const newMenssagens = [];
    menssagens.map((m) => {
      if (m.type === "global") {
        newMenssagens.push(m);
      } else if (m.type === "private") {
        const userPrivate = m.sala.split("-");
        if (localUser.name == userPrivate[0]) {
          let newM = {
            ...m,
            type: "mine-private",
          };
          newMenssagens.push(newM);
        } else if (localUser.name == userPrivate[1]) {
          let newM = {
            ...m,
            type: "other-private",
          };
          newMenssagens.push(newM);
        }
      } else if (m.sala == localSala && m.user.id == localUser.id) {
        let newM = {
          ...m,
          type: "mine",
        };
        newMenssagens.push(newM);
      } else if (m.sala == localSala && m.user.id != localUser.id) {
        let newM = {
          ...m,
          type: "other",
        };
        newMenssagens.push(newM);
      }
    });

    return newMenssagens;
  };

  useEffect(() => {
    socket.emit("getSalas", {});
    const _id = id;
    socket.emit("getChat", {
      id: _id,
    });
  }, [id]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage nick={nick} setNick={setNick} conectar={conectar} />
          }
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
              sairSala={sairSala}
            />
          }
        />
        <Route
          path="/chatList/chat/:chatId"
          element={
            <Chat
              messages={messages}
              updateMessages={updateMessages}
              setUsersOn={setUsersOn}
              usersOn={usersOn}
              menssagens={menssagens}
              setMenssagens={setMenssagens}
              enviarMenssagem={enviarMenssagem}
              getMenssagens={getMenssagens}
              privateChats={privateChats}
              setPrivateChats={setPrivateChats}
              newSala={newSala}
              atualizarMensagens={atualizarMensagens}
              chats={chats}
            />
          }
        />
      </Routes>
      <Modal show={showError} onHide={() => setShowError(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Erro!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Já existe um usuario ou sala com esse nome</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowError(false)}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default App;
