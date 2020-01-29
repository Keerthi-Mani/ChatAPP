//Dependencies
const mongo = require("mongodb").MongoClient;
const client = require("socket.io").listen(4000).sockets;

//Connect to Mongodb
const url = "mongodb://127.0.0.1/mongochat";
mongo.connect(url, function(err, db) {
  if (err) {
    throw err;
  }
  console.log("Mongodb is connected .....");
});
