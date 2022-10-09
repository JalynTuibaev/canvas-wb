const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const app = express();

require('express-ws')(app);
const port = 8000;

app.use(cors());

app.ws('/canvas', (ws, req) => {

});

app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});