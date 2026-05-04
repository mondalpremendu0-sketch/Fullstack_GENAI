const mongoose = require('mongoose');

async function Connect_to_db() {
  await mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected To Db");
  })
  .catch((error) => {
    console.error('Db error =>', error);
    
  })
}

module.exports = Connect_to_db;