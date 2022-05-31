require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyPaser = require("body-parser");
const mongoose = require("mongoose");
const cookiePareser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const port = process.env.PORT || 5000;
const server = http.createServer(app);

const productRouter = require("./api/routes/products");
const orderRouter = require("./api/routes/orders");
const userRouter = require("./api/routes/user");
const commentRouter = require("./api/routes/comment");
const chatRouter = require("./api/routes/chat");

const Chat = require("./api/models/chat");

app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(cookiePareser());

app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_ATLAS_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useUnifiedTopology: false,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

mongoose.Promise = global.Promise;

mongoose.connection.on("connected", () => {
  console.log("CONNECTED TO MONGO ATLAS");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on(
    "send_message",
    async ({
      room,
      productId,
      productImage,
      productName,
      salerId,
      salerUsername,
      content,
      fromId,
      type,
      createdAt,
    }) => {
      try {
        const doseConversationExist = await Chat.exists({ room });
        if (!doseConversationExist) {
          const newConversation = new Chat({
            _id: new mongoose.Types.ObjectId(),
            product: productId,
            room,
            buyer: fromId,
            updatedAt: createdAt,
            messages: {
              content,
              from: fromId,
              createdAt,
              type,
            },
          });

          await newConversation.save();
          io.sockets.emit("receive_message", {
            isNewChat: true,
            room,
            productId,
            productImage,
            productName,
            salerId,
            salerUsername,
            content,
            fromId,
            type,
            createdAt,
          });
        } else {
          await Chat.updateOne(
            { room, product: productId },
            {
              updatedAt: createdAt,
              $push: {
                messages: {
                  content,
                  from: fromId,
                  createdAt,
                  type,
                },
              },
            }
          );
          io.sockets.emit("receive_message", {
            isNewChat: false,
            room,
            productId,
            productImage,
            productName,
            salerId,
            salerUsername,
            content,
            fromId,
            type,
            createdAt,
          });
        }
      } catch (err) {
        socket.to(room).emit("err_message", {
          err,
        });
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/users", userRouter);
app.use("/comments", commentRouter);
app.use("/chats", chatRouter);

app.use((_, __, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, _, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

server.listen(port, () => {
  console.log("SERVER RUNNING ON PORT", port);
});
