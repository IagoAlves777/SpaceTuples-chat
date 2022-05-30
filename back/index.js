const Koa = require("koa");
const http = require("http");
const socket = require("socket.io");

const app = new Koa();
const server = http.createServer(app.callback());
const io = socket(server);

const SERVER_HOST = "localhost";
const SERVER_PORT = 8080;
let spaceTuples = [];

function readAllChats(spaceTuples) {
  function filtrar(value) {
    if (value.type === "sala") {
      return value;
    }
  }
  retorno = spaceTuples.filter(filtrar);
  return retorno;
}
function readChatById(spaceTuples, id) {
  function filtrar(value) {
    if (value.id == id) {
      return value;
    }
  }
  retorno = spaceTuples.filter(filtrar);
  return retorno;
}

function writeUserSala(spaceTuples, usersSala) {
  const _spaceTuples = [...spaceTuples];
  _spaceTuples.map((t, index) => {
    if (t.id === usersSala[0].sala && t.type === "sala") {
      t.usuarios.splice(0, t.usuarios.lentgh);
      t.usuarios = usersSala;
    }
  });
  return spaceTuples;
}

function readPlayerBySala(spaceTuples, salaId) {
  function filtrar(value) {
    if (value.sala === salaId && value.type === "player") {
      return value;
    }
  }
  retorno = spaceTuples.filter(filtrar);
  return retorno;
}

function write(spaceTuples, tuple) {
  const _spaceTuples = [...spaceTuples];
  _spaceTuples.map((t, index) => {
    if (t.id === tuple.id && t.type === tuple.type) {
      spaceTuples.splice(index, 1, tuple);
    } else if (index === _spaceTuples.lentgh - 1) {
      spaceTuples.push(tuple);
    }
  });
  return spaceTuples;
}

io.on("connection", (socket) => {
  socket.on("newUser", (data) => {
    const newUser = {
      type: "player",
      sala: null,
      id: Math.floor(Math.random() * 100),
      name: data.name,
    };
    spaceTuples.push(newUser);
    socket.emit("newUser", newUser);
  });

  socket.on("newSala", (data) => {
    const newSala = {
      type: "sala",
      id: Math.floor(Math.random() * 100),
      name: data.sala,
      usuarios: [],
    };
    spaceTuples.push(newSala);
    io.emit("newSala", readAllChats(spaceTuples));
  });

  socket.on("getSalas", () => {
    io.emit("getSalas", readAllChats(spaceTuples));
  });

  socket.on("getChat", (data) => {
    io.emit("getChat", readChatById(spaceTuples, data.id));
  });

  socket.on("entrarSala", (data) => {
    const newUser = { ...data.user, sala: data.salaId };
    spaceTuples = write(spaceTuples, newUser);
    const usersSala = readPlayerBySala(spaceTuples, data.salaId);
    spaceTuples = writeUserSala(spaceTuples, usersSala);
    io.emit("entrarSala", newUser);
    io.emit("usersSala", readChatById(spaceTuples, data.salaId));
  });
});

server.listen(SERVER_PORT, SERVER_HOST, () => {});
