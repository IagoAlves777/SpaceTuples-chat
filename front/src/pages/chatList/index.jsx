import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap/";
import { CardNoChats } from "../../components/cardNoChats";
import { ModalNewChat } from "../../components/modalNewChat";
import { useParams, useNavigate } from "react-router-dom";
import "./styles.css";
import { getOverlayDirection } from "react-bootstrap/esm/helpers";

export const ChatList = ({
  nameChat,
  setNameChat,
  newSala,
  chats,
  user,
  entrarSala,
}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const localStorageList = [];
  for (var i = 0; i < localStorage.length; i++) {
    localStorageList.push(localStorage.key(i));
  }
  const haveTheKey = localStorageList.filter(function (item) {
    return item === "sala";
  });

  const closeModal = () => {
    setShowModal(false);
  };

  function goTo(chat) {
    entrarSala(chat.id, user);
    navigate(`/chatList/chat/${chat.id}`);
  }

  useEffect(() => {
    if (haveTheKey.length > 0) {
      localStorage.setItem("sala", "");
    }
    const localSala = localStorage.getItem("sala");
    console.log(
      "🚀 ~ file: index.jsx ~ line 41 ~ useEffect ~ localSala",
      localSala
    );
  }, []);
  return (
    <>
      <Card id="cardList">
        <Card.Body id="cardList-body">
          <Card.Title>Salas disponiveis</Card.Title>
          <div className="content">
            {chats.length ? (
              chats.map((chat, index) => (
                <Card
                  onClick={() => goTo(chat)}
                  id="chats-card"
                  bg={"dark"}
                  key={"Dark"}
                  text={"light"}
                  style={{ width: "24rem" }}
                >
                  <Card.Body>
                    <Card.Title>{chat.name}</Card.Title>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <CardNoChats />
            )}
          </div>
          <div className="footer" onClick={() => setShowModal(true)}>
            <h2 className="add">➕ Criar uma nova sala</h2>
          </div>
        </Card.Body>
      </Card>
      <ModalNewChat
        show={showModal}
        handleClose={closeModal}
        nameChat={nameChat}
        setNameChat={setNameChat}
        newSala={newSala}
      />
    </>
  );
};
