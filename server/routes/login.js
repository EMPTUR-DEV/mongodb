const config = require('../config/config');
const utiles = require('../utiles/utiles');

const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const Usuario = require('../models/usuario');


let getToken = (usuarioDB) => {
    return jwt.sign({ usuario: usuarioDB },
        process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });
}

encriptarPass = (pass) => {
    return bcrypt.hashSync(pass, loopEncPass);
}

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return utiles.respuesta(500, err, res);
        }
        if (!usuarioDB || !body.password || !bcrypt.compareSync(body.password, usuarioDB.password)) {
            return utiles.respuesta(400, { err, mensaje: 'Usuario o contraseña incorrectas.' }, res);
        }
        if (usuarioDB.google) {
            return utiles.respuesta(403, 'Logueate con google vos que podes', res);
        }

        let token = getToken(usuarioDB)

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    })



});

// Configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend

    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
}



app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return utiles.respuesta(403, {
                e: { message: 'Error de google user' }
            }, res)
        });



    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {


        if (err) {
            console.log('Error');
            return utiles.respuesta(500, err, res)
        }


        if (usuarioDB) {
            console.log('Existe el usuario');
            if (usuarioDB.google === false) {
                console.log('No es de google');
                return utiles.respuesta(400, { err: { message: 'Debe usar autenticación normal' } }, res);
            } else {

                console.log('Es de google');

                let token = getToken(usuarioDB);

                console.log('Se leyó el token bien');

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            }
        } else {
            // Si el usuario no existe en la base de datos

            console.log('No existe el usuario');

            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = googleUser.google;
            usuario.password = encriptarPass('8==D');

            usuario.save((err, usuarioDB) => {
                if (err) { return utiles.respuesta(500, err, res) }
            });

            let token = getToken(usuarioDB);

            return res.json({
                ok: true,
                usuario: usuarioDB,
                token
            });

        }


        // res.json({
        //     usuario: googleUser,
        // });



    });

});

module.exports = app;