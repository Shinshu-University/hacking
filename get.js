  let data = [];
  const socket = new WebSocket('wss://cloud.achex.ca/hackingdemo');

  socket.addEventListener('open', function (event) {
    socket.send('{"auth":"admin", "password":"pass"}');
  });

  socket.addEventListener('message', function (event) {
    const json = JSON.parse(event.data)
    if (json.auth == 'OK') {
      return
    }
    console.log(json.msg);
    if (json.msg == 'finish') {
      console.log(data.join(''));
      const a = document.createElement('a');
      a.href = data.join('');
      a.download = 'image.png';
      a.click();
      data = [];
    } else {
      data[data.length] = json.msg;
    }
  })
