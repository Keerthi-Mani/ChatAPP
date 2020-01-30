(function() {
  //Get Elements
  var userName = document.getElementById("username");
  var textArea = document.getElementById("textarea");
  var messages = document.getElementById("messages");
  var status = document.getElementById("status");
  var clearBtn = document.getElementById("clear");

  //Status
  var statusDefault = status.textContent;

  var setStatus = function(status) {
    // Set status
    status.textContent = status;

    if (status !== statusDefault) {
      var delay = setTimeout(function() {
        setStatus(statusDefaults);
      }, 4000);
    }
  };

  // Connect to socket.io
  var socket = io.connect("http://127.0.0.1:4000");

  //Check for connection
  if (socket !== undefined) {
    console.log("Connected to socket...");

    //Handle outputs
    socket.on("output", function(data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        //Build out message div
        var message = document.createElement("div");
        message.setAttribute("class", "chat-message");
        message.textContent = data[i].name + ": " + data[i].message;
        messages.appendChild(message);
        messages.insertBefore(message, messages.firstChild);
      }
    });

    //Get Status from Server
    socket.on("status", function(data) {
      setStatus(typeof data === "object" ? data.message : data);

      //If status is clear
      if (data.clear) {
        textArea.value = "";
      }
    });

    //Handle input
    textArea.addEventListener("keyDown", function(event) {
      event.preventDefault();
      if (event.which === 13 && event.shiftKey == false) {
        //Emit to server input
        socket.emit("input", {
          name: userName.value,
          message: textArea.value
        });
        console.log("Name :" + name);
        console.log("Message :" + message);
      }
    });

    //Handle Chat clear
    clearBtn.addEventListener("click", function() {
      socket.emit("clear");
    });

    //Clear Message
    socket.on("cleared", function() {
      messages.textContent = " ";
    });
  }
})();
