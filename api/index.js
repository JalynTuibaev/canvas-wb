const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const app = express();

require('express-ws')(app);
const port = 8000;

app.use(cors());

const activeConnections = {};
let pixelsArray = [];

app.ws('/canvas', (ws) => {
    const id = nanoid();

    console.log('Client connected id=', id);
    activeConnections[id] = ws;

    if (pixelsArray.length > 0) {
        ws.send(pixelsArray);
    }

    ws.on('close', () => {
        console.log('Client disconnected! id=', id);
        delete activeConnections[id];
    });


    ws.on('message', drawing => {
        Object.keys(activeConnections).forEach(connId => {
            const conn = activeConnections[connId];

            pixelsArray = drawing;
            conn.send(drawing);
        });
    });
});

app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});