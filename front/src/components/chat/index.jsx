import "./styles.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useId } from "../../context/IdContext";
import { useChat } from "../../context/chatContext";
import { Card, Button, Offcanvas, CloseButton } from "react-bootstrap";
import userIcon from "../../assets/users.png";

export const Chat = () => {
  const { chat } = useChat();
  const { chatId } = useParams();
  const { setId } = useId();
  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  const [usersOn, setUsersOn] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setId(chatId);
  }, [chatId]);

  useEffect(() => {
    if (chat.length > 0) {
      setTitle(chat[0].name);
      setUsersOn(chat[0].usuarios);
    }
  }, [chat]);

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
            <CloseButton />
          </div>
          <Card.Text>...</Card.Text>
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
