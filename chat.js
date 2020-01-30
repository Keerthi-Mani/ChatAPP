(function() {
  //Get Elements
  var userName = document.getElementBy("username");
  var textArea = document.getElementBy("textarea");
  var messages = document.getElementBy("messages");
  var status = document.getElementBy("status");
  var clearBtn = document.getElementBy("clear");

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

  //Handle input
  textArea.addEventListener("keyDown", function(event) {
    event.preventDefault();
    if (event.which === 13 && event.shiftKey == false) {
      //Emit to server input
      socket.emit("input", {
        name: userName.value,
        message: textArea.value
      });
    }
  });

  //Handle Chat clear
  clearBtn.addEventListener("click", function() {
    socket.emit("clear");
  });
})();
