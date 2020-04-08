require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const app = express();
const bodyParser = require('body-parser');

// parse del body para usuario
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Habilitar la carpeta public

app.use(express.static(path.resolve(__dirname, '../public')));

console.log(path.resolve(__dirname, '../public'));

// Configuración local de rutas
app.use(require('./rutas/index'));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {

        if (err) throw err;
        console.log('Base de datos ONLINE ');
        console.log('Base de datos en: ' + process.env.URLDB);
        console.log('Token seed: ' + process.env.SEED_TOKEN);
        console.log('Vencimiento: ' + process.env.CADUCIDAD_TOKEN);


    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});