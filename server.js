//Install express server
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/d3v5-angular7'));

app.get('/*', function (req, res) {

  res.sendFile(path.join(__dirname + '/dist/d3v5-angular7/index.html'));
});

app.listen(process.env.PORT || 8080);
