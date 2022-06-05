const Koa = require("koa");
const http = require("http");
const socket = require("socket.io");

const app = new Koa();
const server = http.createServer(app.callback());
const io = socket(server);

const SERVER_HOST = "localhost";
const SERVER_PORT = 8080;
let spaceTuples = [];
let TuplesMenssagers = [];

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
  const retorno = spaceTuples.filter(filtrar);
  return retorno;
}

function writeMenssagem(spaceTuples, menssagem) {
  spaceTuples.push(menssagem);
  return spaceTuples;
}

function writeExitSala(spaceTuples, user) {
  function removeItem(arr, prop, value) {
    return arr.filter(function (i) {
      return i[prop] !== value;
    });
  }
  const _spaceTuples = [...spaceTuples];
  _spaceTuples.map((t) => {
    if (t.type === "player" && t.id === user.id) {
      t.sala = "";
    }
    if (t.type === "sala" && t.id === user.sala) {
      const newUsers = removeItem(t.usuarios, "id", user.id);
      t.usuarios.splice(0, t.usuarios.lentgh);
      t.usuarios = newUsers;
    }
  });
  return _spaceTuples;
}

function writeUserSala(spaceTuples, usersSala) {
  const _spaceTuples = [...spaceTuples];
  _spaceTuples.map((t) => {
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
    const NotExists = spaceTuples.every((s) => s.name !== data.sala);
    if (!NotExists) {
      io.emit("newSala", {
        tupleSpace: readAllChats(spaceTuples),
        user: data.user,
      });
      return;
    }
    if (data.user === "private") {
      const newSala = {
        type: "sala",
        id: Math.floor(Math.random() * 100),
        name: data.sala,
        usuarios: [],
        private: true,
      };
      spaceTuples.push(newSala);
      io.emit("newSala", {
        tupleSpace: readAllChats(spaceTuples),
        user: "private",
      });
    } else {
      const newSala = {
        type: "sala",
        id: Math.floor(Math.random() * 100),
        name: data.sala,
        usuarios: [],
        private: false,
      };
      spaceTuples.push(newSala);
      io.emit("newSala", {
        tupleSpace: readAllChats(spaceTuples),
        user: "",
      });
    }
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

  socket.on("exitSala", (data) => {
    spaceTuples = writeExitSala(spaceTuples, data.user);
    io.emit("exitSala", readChatById(spaceTuples, data.user.sala));
  });

  socket.on("newMenssagem", (menssagem) => {
    if (menssagem === "") {
      io.emit("newMenssagem", TuplesMenssagers);
      return;
    }
    TuplesMenssagers = writeMenssagem(TuplesMenssagers, menssagem);
    io.emit("newMenssagem", TuplesMenssagers);
  });
});

server.listen(SERVER_PORT, SERVER_HOST, () => {});
