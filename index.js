const express = require('express');
const fs = require('fs');
const accountRouter = require('./routes/AccountRouter');

// config
const app = express();
app.use(express.json());

// constants
const port = 3000;
const fileName = 'tetinha.json';

app.listen(port, () => {
  console.log('API viva na porta ' + port);
})

app.use('/', accountRouter);

