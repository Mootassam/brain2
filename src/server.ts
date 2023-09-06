import mongoose from "mongoose";
import express, { Application, Request, Response } from "express";
import phoneNumberRoutes from "./routes/phoneNumberRoutes";
import cors from "cors";
import http from "http";
import { Server } from "socket.io"; // Import the Server class from socket.io

const app: Application = express();
const PORT = 8080;
const bodyParser = require("body-parser");

app.use(cors({ origin: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://192.168.5.90", // Replace with the origin of your client
    methods: ["GET", "POST"],
  },
}); // Create a new Socket.io server and attach it to your HTTP server

mongoose
  .connect("mongodb://127.0.0.1:27017/phonenumber", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server after successful database connection
    server.listen(PORT, "192.168.5.90", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB", error);
  });
// Add Socket.io event handling here
io.on("connection", (socket) => {
  // You can handle custom Socket.io events here
});

app.use("/api/phone", phoneNumberRoutes(io));
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the API");
});
