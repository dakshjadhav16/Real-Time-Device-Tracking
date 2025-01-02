const express=require('express');
const app=express();
const path=require('path');
// Socketio runs on http server
const http=require('http');
const Socketio=require('socket.io');
const server=http.createServer(app); // The main function of http is creating a server
const io=Socketio(server);

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));  // to use static files such as images,js,css 

io.on("connection",function(socket)
{
    console.log("User connected:", socket.id);
    socket.on("send-location",function(data)  // Accepting data from socket and sending the data again to all on the frontend
{
    io.emit("receive-location", {id:socket.id, ...data}); //sending the data to all the users connected with
})
    socket.on("disconnect",function()
{
    console.log("User disconnected:", socket.id);
    io.emit("user-disconnected", socket.id);
})
})

app.get("/",function(req,res)
{
    res.render("index");
})

server.listen(3000);