import { Card } from "react-bootstrap";
import "./styles.css";

export const CardNoChats = () => {
  return (
    <div className="noChats">
      <Card id="cardNoChats">
        <h2>Nenhuma sala criada ainda... 😪</h2>
      </Card>
    </div>
  );
};
