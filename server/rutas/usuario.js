const config = require('../config/config');
const express = require('express');


const bcrypt = require('bcrypt');

const _ = require('underscore');

const app = express();
const Usuario = require('../modelos/usuario');


esquemaUsuario = (body) => {
    return new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: encriptarPass(body.password),
        role: body.role
    })
}
encriptarPass = (pass) => {
    return bcrypt.hashSync(pass, loopEncPass);
}

app.get('/usuario', function(req, res) {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;



    let condicionesGET = {
        estado: true
    }
    let propiedadesGET = 'nombre email rol estado google img'

    Usuario.find(condicionesGET, propiedadesGET)
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count(condicionesGET, (err, cantidad) => {

                res.json({
                    ok: true,
                    conteo: cantidad,
                    usuarios
                });
            });
        });
});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = esquemaUsuario(body)

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })

});

app.put('/usuario/:id', function(req, res) {

    // el segundo id es el del parametro
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    if (body.password != null) body.password = encriptarPass(body.password);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB,
            id
        })

    });
});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: false }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado || !usuarioBorrado.estado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario ya eliminado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });


    })



});

module.exports = app;