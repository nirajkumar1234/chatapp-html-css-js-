const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", function (socket) {
    socket.on("newuser", function (username) {
        socket.broadcast.emit("update", username + " joined the conversation (" + new Date().toDateString().replace(" ", ":").replace(" ", ":").replace(" ", ":") + ")");
    });

    socket.on("exituser", function (username) {
        socket.broadcast.emit("update", username + " exit the conversation (" + new Date().toDateString().replace(" ", ":").replace(" ", ":").replace(" ", ":") + ")");
    });

    let typingUsers = new Set();

    socket.on("typing", function (username) {
        typingUsers.add(username);
        socket.broadcast.emit("typing", Array.from(typingUsers));
    });

    socket.on("stop-typing", function (username) {
        typingUsers.delete(username);
        socket.broadcast.emit("stop-typing", Array.from(typingUsers));
    });

    socket.on("chat", function (message) {
        socket.broadcast.emit("chat", message);
        typingUsers.clear(); // clear typing users when message is sent
    });

});

server.listen(5000, () => {
    console.log(`App is listening on http://localhost:5000`);
});
