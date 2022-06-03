import "./styles.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useId } from "../../context/IdContext";
import { useChat } from "../../context/chatContext";
import { Card, Button, Offcanvas, CloseButton, Form } from "react-bootstrap";
import userIcon from "../../assets/users.png";

export const Chat = ({ usersOn, setUsersOn, existError }) => {
  const navigate = useNavigate();
  const { chat } = useChat();
  const { chatId } = useParams();
  const { setId } = useId();
  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const user = JSON.parse(localStorage.getItem("user"));

  let menssagens = [
    {
      user: "snorlax143",
      text: "Aqui um exemplo de uma menssagem minha",
      destino: "sala",
    },
    {
      user: "Davi gamer",
      text: "Aqui um exemplo de uma menssagem dos outros",
      destino: "sala",
    },
  ];

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
          <div className="div_messenger">
            <main className="main_chat">
              <div className="chat_scroll">
                <ul className="list">
                  {menssagens.map((m, index) => (
                    <div>{user.name}</div>
                  ))}
                </ul>
              </div>
              <Form onSubmit={null}>
                <Form.Control
                  size="lg"
                  type="text"
                  placeholder="Type a new message here"
                />
              </Form>
            </main>
          </div>
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
