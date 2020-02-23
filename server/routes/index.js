const express = require('express');

const Usuario = require('../models/usuario');

const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categorias'));
app.use(require('./producto'));





module.exports = app;