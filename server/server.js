require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');




app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json())


app.post('/usuario', function(req, res) {

    let body = req.body;

    if (body.nombre == undefined) {
        res.status(400).json({
            ok: false,
            mensaje: "El nombre es necesario"
        })
    } else {
        res.json({
            body
        })
    }
});

app.get('/usuario', function(req, res) {
    res.send('get Usuario')
});

app.put('/usuario/:id', function(req, res) {

    // el segundo id es el del parametro
    let id = req.params.id;
    res.json({
        id
    })
});

app.delete('/usuario', function(req, res) {
    res.send('delete Usuario')
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});