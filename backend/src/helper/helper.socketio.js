const { Server } = require("socket.io");

function initSocketIo(httpServer){
  
  const io = new Server(httpServer, { /* options */ });

    io.on("connection", (socket) => {

      console.log("User connected",socket.id);
      socket.on("disconnect",() => {
        console.log("User disconnected");
      })

      socket.on("message",(data) => {
        console.log(data);
      })
      
})
}

module.exports = initSocketIo;
