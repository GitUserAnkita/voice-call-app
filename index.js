const express = require("express");
const app = express();
const handlebars = require("express-handlebars");


const http = require("http").Server(app);
const io = require("socket.io")(http);

require('dotenv').config();

const socketsStatus = {};
const PORT = process.env.PORT || 3000

const customHandlebars = handlebars.create({ layoutsDir: "./views" });

app.engine("handlebars", customHandlebars.engine);
app.set("view engine", "handlebars");

io.on("connection", function (socket) {
    const socketId = socket.id;
    console.log("socket id = ",socketId)
    socketsStatus[socket.id] = {};

    console.log("connected successfully...........");
    socket.on("voice", function (data) {

        var newData = data.split(";");
        newData[0] = "data:audio/ogg;";
        newData = newData[0] + newData[1];

        for (const id in socketsStatus) {
            if (id != socketId && !socketsStatus[id].mute && socketsStatus[id].online)
                socket.broadcast.to(id).emit("send", newData);
        }

    });

    socket.on("userInformation", function (data) {
        socketsStatus[socketId] = data;

        io.sockets.emit("usersUpdate", socketsStatus);
    });


    socket.on("disconnect", function () {
        delete socketsStatus[socketId];
    });

});

app.use("/files", express.static("public"));

app.get("/", (req, res) => {
    res.render("index");
});


// app.get("/test", audio);

http.listen(PORT, () => {
    console.log(`the app is run in port:${PORT}`);
});

