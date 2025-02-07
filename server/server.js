const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
    // Handle incoming message
    });

    ws.on('close', function() {
    // Handle connection close
    });
});