require('dotenv').config();
const { createServer } = require("http");
const app = require("./src/app.js");
const Connect_to_db = require('./src/db/db.js');
const initSocketIo = require('./src/helper/helper.socketio.js')


const httpServer = createServer(app);
initSocketIo(httpServer);
Connect_to_db();
httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});