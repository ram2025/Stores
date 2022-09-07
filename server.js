const express = require('express');
const app = express();

app.get('/', (request, response) => {
    response.end("wellcome");
});
let port = process.env.PORT || 4000;
app.listen(port);