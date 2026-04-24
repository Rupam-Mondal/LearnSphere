import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/configs/db.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => {
    socket.emit('me', socket.id);
    socket.on('disconnect', () => {
        socket.broadcast.emit('message', `Socket ${socket.id} disconnected`);
    });
    

    socket.on("callUser", ({ userToCall, signalData, from, name }) =>{
        io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    } )

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    }); 

});

await connectDB();
server.listen(process.env.PORT || 3000, async () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});