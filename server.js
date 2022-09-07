const express = require('express');
const app = express();

app.get('/', (request, response) => {
    response.end("wellcome");
});

const port = process.env.port || 4000;
app.listen(port);