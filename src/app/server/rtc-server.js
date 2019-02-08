const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors')
const https = require("https")


let clients = [];

app.use(cors({
  credentials: true,
}));

app.get('/', function (req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (client) {
  console.log('Client connected...');

  client.on('setinfo', function (data) {

    var clientInfo = new Object();
    clientInfo.customId = data.cid;
    clientInfo.userpic  = data.cimg;
    clientInfo.clientId = client.id;
    clients.push(clientInfo);
    let infolist = clients.filter(x=>x.clientId != client.id);
    all('clients', infolist);
  });



  client.on('getclients' , function(data){
    let infolist = clients.filter(x=>x.clientId != client.id);
    all('clients', infolist);
  })

  client.on('candidate', function (data) {
    "use strict";
    console.log(data);
    //client.broadcast.emit('candidate', data);
  });

  client.on('offer', function (data) {
    "use strict";
    console.log(client);
    console.log(data);
    let info = clients.filter(x=>x.customId == data.id)[0];
    let cinfo = clients.filter(x=>x.clientId == client.id)[0];
    io.sockets.connected[info.clientId].emit('offer', {
       payload : data.offer,
       id : cinfo.customId
    });
  });
  client.on('answer', function (data) {
    "use strict";
    console.log(client);
    console.log(data);
    let info = clients.filter(x=>x.customId == data.id)[0];
    io.sockets.connected[info.clientId].emit('answer', data);
  });

  client.on('disconnect', function (data) {

    let index = clients.findIndex(x=>x.clientId == client.id);
  
    if(index == -1) return ;
  
    clients.splice(index, 1);  

    all('clients', clients);
  });

  function all(event , data){
    clients.forEach(client => {
      io.sockets.connected[client.clientId].emit(event, data);
    });
  }
});


server.listen(4205, () => {
  "use strict";
  console.log('server start at 4205');
});
