var socket = io();

socket.on("connect", () => {
    console.log("Connected to server");

    //send an event to server
    // socket.emit("createMessage", {
    //     from: "localhost",
    //     text: "Text send to server"
    // });
});

//take an event from server
socket.on('newMessage', (message) => {
    console.log(message);
})