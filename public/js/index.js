var socket = io();

socket.on("connect", () => {
    console.log("Connected to server");
});

//take an event from server
socket.on('newMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('LT');
    const template = document.querySelector('#message-template').innerHTML;
    
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });
    
    const div = document.createElement('div');
    div.innerHTML = html

    document.querySelector('#messages').appendChild(div);
})

socket.on('newMessageLocation', (message) => {
    console.log(message);

    let li = document.createElement('li');
    let a = document.createElement('a');
    a.setAttribute('target', '_blank');
    a.setAttribute('href', message.url);
    a.innerText = 'My current location';
    li.appendChild(a);

    document.querySelector('body').appendChild(li);
})

document.querySelector('#submit-btn').addEventListener('click', function(e) {
  e.preventDefault();

  socket.emit("createMessage", {
    text: document.querySelector('input[name="message"]').value
  }, function() {
    document.querySelector('input[name="message"]').value = '';
  })
})

document.querySelector('#send-location').addEventListener('click', (e) => {
    if(!navigator.geolocation) {
        alert(false);
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('createLocationMessage', {
            lat: position.coords.latitude,
            long: position.coords.longitude
        });
    }, () => {
        alert("Unable fetch location!!!");
    })
})