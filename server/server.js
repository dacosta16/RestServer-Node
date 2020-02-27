require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Habilitar la carpeta Public
app.use(express.static(path.resolve(__dirname, '../public')));

//Configuracion Global de Rutas
app.use(require('./routes/index'));



mongoose.connect(process.env.urlDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },

    (err, resp) => {
        if (err) throw err;

        console.log('Base de Datos ONLINE');

    }


);


/*mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
    if (err) throw err;
    console.log('Base de Datos Online');
});*/

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
});