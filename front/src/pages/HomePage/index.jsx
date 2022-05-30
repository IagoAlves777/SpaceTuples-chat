import { Card, Button, Form } from "react-bootstrap";
import "./styles.css";

export const HomePage = ({ nick, setNick, conectar }) => {
  const handleChange = (e) => {
    setNick(e.target.value);
  };

  return (
    <Card style={{ width: "30rem", height: "17rem" }}>
      <Card.Body id="card-home">
        <Card.Title>Registre-se aqui</Card.Title>
        <Form.Control
          id="nick"
          size="lg"
          type="text"
          placeholder="Nick"
          onChange={handleChange}
          value={nick}
        />
        <Button variant="dark" onClick={() => conectar(nick)}>
          Iniciar
        </Button>
      </Card.Body>
    </Card>
  );
};
