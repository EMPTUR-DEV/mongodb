const config = require('../config/config');
const utiles = require('../utiles/utiles');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../modelos/usuario');


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return utiles.respuesta(500, err, res);
        }
        if (!usuarioDB || !body.password || !bcrypt.compareSync(body.password, usuarioDB.password)) {
            return utiles.respuesta(400, { err, mensaje: 'Usuario o contraseña incorrectas.' }, res);
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    })



});


module.exports = app;