import { useState, useEffect } from "react";
import { Card, Button, Form, Modal } from "react-bootstrap";
import "./styles.css";

export const ModalNewChat = ({
  show,
  handleClose,
  setNameChat,
  nameChat,
  newSala,
}) => {
  const handleChange = (e) => {
    setNameChat(e.target.value);
  };

  const novaSala = () => {
    const localuser = JSON.parse(localStorage.getItem("user"));
    setNameChat("");
    newSala(nameChat, localuser);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Criar nova sala</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Nome da sala"
            onChange={handleChange}
            value={nameChat}
          />
          <div className="buttons">
            <Button variant="dark" onClick={() => novaSala()}>
              Criar Sala
            </Button>
          </div>
        </>
      </Modal.Body>
    </Modal>
  );
};
