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

  // Connect to Socket.io
  client.on("connection", function(socket) {
    let chat = db.collection("chats");

    //Create a function to send status
    sendStatus = function(status) {
      socket.emit("status", status);
    };

    //Get chats from mongo collection
    chat
      .find()
      .limit(100)
      .sort({ _id: 1 })
      .toArray(function(err, res) {
        if (err) {
          throw err;
        }

        //Emit the messages to the client
        socket.emit("output", res);
      });

    //Handle input events
    socket.on("input", function(data) {
      let name = data.name;
      let message = data.message;

      //Check for name and messages
      //Send error status
      if (name == "" || message == "") {
        sendStatus("Please enter a name and message!!!");
      } else {
        //Insert message
        chat.insert({ name: name, message: message }, function() {
          client.emit("output", [data]);

          //Send status object
          sendStatus({
            message: "Message Sent",
            clear: true
          });
        });
      }
    });

    //Handle clear
    socket.on("clear", function(data) {
      //Remove all chats from collection
      chat.remove({}, function() {
        //Emit cleared
        socket.emit("cleared");
      });
    });
  });
});
