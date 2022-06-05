import "./styles.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useId } from "../../context/IdContext";
import { useChat } from "../../context/chatContext";
import { Card, Tabs, Tab, Offcanvas, CloseButton, Form } from "react-bootstrap";
import userIcon from "../../assets/users.png";

export const Chat = ({
  usersOn,
  setUsersOn,
  menssagens,
  enviarMenssagem,
  getMenssagens,
  setMenssagens,
  privateChats,
  setPrivateChats,
  atualizarMensagens,
  newSala,
  chats,
}) => {
  const navigate = useNavigate();
  const { chat } = useChat();
  const { chatId } = useParams();
  const { setId } = useId();
  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [menssagem, setMensagem] = useState("");
  const [globalMenssagem, setGlobalMenssagem] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleMenssageChange = (event) => setMensagem(event.target.value);

  useEffect(() => {
    setId(chatId);
  }, [chatId]);

  useEffect(() => {
    if (chat.length > 0) {
      setTitle(chat[0].name);
      setUsersOn(chat[0].usuarios);
    }
  }, [chat]);

  function goTo() {
    navigate(`/chatList`);
  }

  useEffect(() => {
    const newChatPrivate = [];
    chats.map((chat) => {
      const userPrivate = chat.name.split("-");
      if (userPrivate[0] !== user.name && userPrivate[1] === user.name) {
        newChatPrivate.push(userPrivate[0]);
      } else if (userPrivate[1] !== user.name && userPrivate[0] === user.name) {
        newChatPrivate.push(userPrivate[1]);
      }
    });
    const NotExists = privateChats.every((c) => c !== newChatPrivate);

    if (newChatPrivate.length > 0 && NotExists) {
      const newPrivetsChats = [...privateChats, newChatPrivate];
      setPrivateChats(newPrivetsChats);
    }
  }, [chats]);

  const submitMenssagem = (event) => {
    event.preventDefault();
    let type = "padrao";
    let chat = chatId;
    const localSala = localStorage.getItem("sala");
    if (localSala !== chatId) {
      type = "private";
      chat = localSala;
    }
    if (globalMenssagem) {
      type = "global";
    }
    const _menssagem = {
      type: type,
      user: user,
      sala: chat,
      text: menssagem,
    };
    enviarMenssagem(_menssagem);
    setMensagem("");
  };

  const creatPrivateChat = (userRecipient) => {
    const notExists = privateChats.every((user) => user !== userRecipient);
    const _privates = [...privateChats];
    if (notExists) {
      const privateUser = { id: "private" };
      const nameSala = `${user.name}-${userRecipient.name}`;
      newSala(nameSala, privateUser);
      _privates.push(userRecipient);
    }
  };

  const changeChat = (chat) => {
    if (chat !== chatId) {
      localStorage.setItem("sala", `${user.name}-${chat}`);
    } else {
      localStorage.setItem("sala", chat);
    }
    atualizarMensagens();
  };

  useEffect(() => {
    atualizarMensagens();
  }, []);

  return (
    <div className="chat-main">
      <Card style={{ width: "60%" }}>
        <Card.Body id="chat-content">
          <div className="chat-header">
            <img
              src={userIcon}
              className="chat-icon"
              onClick={handleShow}
            ></img>
            <Card.Title id="chat-title">{title}</Card.Title>
            <CloseButton onClick={() => goTo()} />
          </div>
          <Tabs
            defaultActiveKey={chatId}
            id="uncontrolled-tab-example"
            onSelect={(k) => changeChat(k)}
          >
            <Tab eventKey={user.sala} title="Geral">
              <div className="div_messenger">
                <main className="main_chat">
                  <div className="chat_scroll">
                    <ul className="list">
                      {menssagens.map(
                        (m, index) =>
                          m.type !== "other-private" &&
                          m.type !== "mine-private" && (
                            <li
                              className={`list__item list__item--${m.type}`}
                              key={index}
                            >
                              <div className={`message message--${m.type}`}>
                                <div className="message_header">
                                  <h3
                                    className="message_user"
                                    onClick={() => creatPrivateChat(m.user)}
                                  >
                                    {m.user.name}
                                  </h3>
                                  {m.type === "global" && (
                                    <h3 className="message_global">[GLOBAL]</h3>
                                  )}
                                </div>
                                <h3 className="message_text">{m.text}</h3>
                              </div>
                            </li>
                          )
                      )}
                    </ul>
                  </div>
                  <div className="rodape">
                    <Form.Check
                      type="switch"
                      label="Menssagem global"
                      value={globalMenssagem}
                      onChange={(e) => setGlobalMenssagem(e.target.checked)}
                    />
                    <Form onSubmit={submitMenssagem}>
                      <Form.Control
                        size="lg"
                        type="text"
                        placeholder="Mensagem"
                        onChange={handleMenssageChange}
                        value={menssagem}
                      />
                    </Form>
                  </div>
                </main>
              </div>
            </Tab>
            {privateChats.map((privateChat) => (
              <Tab eventKey={privateChat} title={privateChat}>
                <div className="div_messenger">
                  <main className="main_chat">
                    <div className="chat_scroll">
                      <ul className="list">
                        {menssagens.map(
                          (m, index) =>
                            m.type !== "other" &&
                            m.type !== "mine" && (
                              <li
                                className={`list__item list__item--${m.type}`}
                                key={index}
                              >
                                <div className={`message message--${m.type}`}>
                                  <div className="message_header">
                                    <h3
                                      className="message_user_private"
                                      style={{ color: "white" }}
                                    >
                                      {m.user.name}
                                    </h3>
                                    {m.type === "global" && (
                                      <h3 className="message_global">
                                        [GLOBAL]
                                      </h3>
                                    )}
                                  </div>
                                  <h3
                                    className="message_text"
                                    style={{ color: "white" }}
                                  >
                                    {m.text}
                                  </h3>
                                </div>
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                    <div className="rodape">
                      <Form.Check
                        type="switch"
                        label="Menssagem global"
                        value={globalMenssagem}
                        onChange={(e) => setGlobalMenssagem(e.target.checked)}
                      />
                      <Form onSubmit={submitMenssagem}>
                        <Form.Control
                          size="lg"
                          type="text"
                          placeholder="Mensagem"
                          onChange={handleMenssageChange}
                          value={menssagem}
                        />
                      </Form>
                    </div>
                  </main>
                </div>
              </Tab>
            ))}
          </Tabs>
        </Card.Body>
      </Card>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Usuarios online</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {usersOn.map((user) => (
            <div className="chat-nick">
              <h2>{user.name} </h2>
              <h2>🟢</h2>
            </div>
          ))}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};
