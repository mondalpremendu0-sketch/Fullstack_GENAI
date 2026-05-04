require('dotenv').config();
const app = require("./src/app.js");
const Connect_to_db = require('./src/db/db.js');


Connect_to_db()
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});