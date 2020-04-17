const config = require('../config/config');

const mongoose = require('mongoose');


const express = require('express');
const utiles = require('../utiles/utiles');

let { verificaToken, verificaAdminRol } = require('../middleware/autenticacion');

const _ = require('underscore');

let app = express();

let Categoria = require('../models/categoria');

// ===========================
//  Mostrar todas las categorias
// ===========================


let condicionGET = {};
let propiedadesGET = 'descripcion';

esquemaCategoria = (body) => {
    return new Categoria({
        descripcion: body.descripcion,
        idUsuario: '',
    })
}

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('idUsuario', 'nombre email', 'Usuario')
        .exec((err, categoriaDB) => {
            if (err) return utiles.respuesta(500, err, res);

            Categoria.estimatedDocumentCount(condicionGET, (err, cantidad) => {
                if (err) return utiles.respuesta(400, err, res);

                res.json({
                    ok: true,
                    cantidad,
                    categoriaDB,
                });
            });
        });
});

// Categoria.findbyid

app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;


    Categoria.findById(id, { new: true, runValidators: true },
        (err, categoriaDB) => {

            if (err) return utiles.respuesta(400, { err: { message: 'El id es invalido' } }, res);

            res.json({
                ok: true,
                categoria: categoriaDB,
                id
            });
        });
});


app.post('/categoria', verificaToken, (req, res) => {

    // Regresa la nueva categoria
    let body = req.body;

    let categoria = esquemaCategoria(body)

    categoria.idUsuario = req.usuario._id;



    categoria.save((err, categoriaDB) => {
        if (err) return utiles.respuesta(400, err, res);

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

});



app.put('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion', 'idUsuario']);

    body.idUsuario = req.usuario._id;

    // console.log(body);


    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true },
        (err, categoriaDB) => {

            if (err) return utiles.respuesta(400, { err: { message: 'No existe una categoria con ese id' } }, res)

            res.json({
                ok: true,
                categoria: categoriaDB,
            })
        })



});



app.delete('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, { new: false },
        (err, categoriaBorrada) => {
            if (err) return utiles.respuesta(400, err, res);

            if (!categoriaBorrada) return utiles.respuesta(404, { err: { message: 'Categoria ya eliminada' } }, res);

            res.json({
                ok: true,
                categoria: categoriaBorrada,
                message: 'Categoria eliminada'
            })



        })





});




module.exports = app;