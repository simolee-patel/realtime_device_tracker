const express = require("express");
const app = express();
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const server = http.createServer(app);
const io = socketio(server);

// Use middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

io.on("connection", function(socket) {
    console.log("connected");
    socket.on("send-location", function(data){
        io.emit("receive-location",{id:socket.id,...data})
    })
    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id)
    })
});

app.get("/", (req, res) => {
    res.render("index");
});

// Make sure you listen on the server, not app
server.listen(3000, () => {
    console.log(`App is listening on port 3000`);
});
