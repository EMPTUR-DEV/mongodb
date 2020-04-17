const config = require('../config/config');

const mongoose = require('mongoose');


const express = require('express');
const fileUpload = require('express-fileupload');
const utiles = require('../utiles/utiles');

let Usuario = require('../models/usuario');
let Producto = require('../models/producto');


const fs = require('fs');
const path = require('path');

let { verificaToken, verificaAdminRol } = require('../middleware/autenticacion');



const app = express()

app.use(fileUpload());

app.put('/upload/:tipo/:id', verificaToken, (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) return utiles.respuesta(400, { message: "No se seleccionó ningún archivo" }, res)

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) return utiles.respuesta(400, { message: 'Tipo inválido, los tipos válidos son: ' + tiposValidos.join(), ext: tipo }, res);

    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    // extensiones
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0)
        return utiles.respuesta(400, { message: 'Las extensiones válidas son: ' + extensionesValidas.join(', ') }, res);

    nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;


    archivo.mv(`./uploads/${ tipo }/${nombreArchivo}`, (err) => {
        if (err) return utiles.respuesta(500, err, res)
            // Aca se creo la imagen


        if (tipo === 'usuarios') imagenUsuario(id, res, nombreArchivo);

        if (tipo === 'productos') imagenProducto(id, res, nombreArchivo);

    })
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        borraArchivo(usuarioDB.img, 'usuarios');

        if (err) {
            return utiles.respuesta(500, err, res);
        }

        if (!usuarioDB) {
            return utiles.respuesta(500, { message: 'Usuario no existe' }, res);
        }

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    });
};

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        borraArchivo(productoDB.img, 'productos');

        if (err) {
            return utiles.respuesta(500, err, res);
        }

        if (!productoDB) {
            return utiles.respuesta(500, { message: 'Producto no existe' }, res);
        }

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            if (err) return utiles.respuesta(500, err, res);

            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        })
    });
}

function borraArchivo(nombreArchivo, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreArchivo }`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;