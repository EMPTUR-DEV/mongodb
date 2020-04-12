const config = require('../config/config');

const mongoose = require('mongoose');


const express = require('express');
let app = express();

const utiles = require('../utiles/utiles');

const _ = require('underscore');

let Producto = require('../modelos/producto');

let { verificaToken, verificaAdminRol } = require('../middleware/autenticacion');


// ================
// Obtener producto
// ================

esquemaProducto = (body) => {
    return new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.idCategoria,
        usuario: ''
    })
}

let condicionGET = { disponible: true };
let propiedadesGET = 'nombre';

app.get('/productos', (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;



    Producto.find({})
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email', 'Usuario')
        .populate('categoria', 'descripcion', 'categoria')
        .exec((err, productoDB) => {
            if (err) return utiles.respuesta(500, err, res);

            Producto.estimatedDocumentCount(condicionGET, (err, cantidad) => {
                if (err) return utiles.respuesta(400, err, res);

                res.json({
                    ok: true,
                    cantidad,
                    productoDB
                })
            })
        })

    // Producto.
    // populate usuario categoria
    // paginado

});

app.get('/productos/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id, {})
        .populate('usuario', 'nombre email', 'Usuario')
        .populate('categoria', 'descripcion', 'categoria')
        .exec((err, productoDB) => {


            if (err) return utiles.respuesta(400, { err: { message: 'No es un id válido' } });

            res.json({
                ok: true,
                producto: productoDB,
            });
        });

});


app.get('/productos/buscar/:termino', verificaToken, (req, res) => {


    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');


    Producto.find({ disponible: true, nombre: regex })
        .populate('categoria', 'descripcion', 'categoria')
        .exec((err, productos) => {

            if (err) return utiles.respuesta(500, err, res);

            if (productos == undefined) return utiles.respuesta(200, { message: 'No se encontró un producto con ese término' }, res);

            res.json({
                ok: true,
                productos
            })
        })

});




app.post('/productos', verificaToken, (req, res) => {

    //   Grabar usuario
    //  Grabar la categoria

    let body = req.body;

    let producto = esquemaProducto(body);

    producto.usuario = req.usuario._id;

    producto.save((err, productoDB) => {
        if (err) return utiles.respuesta(400, err, res);

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});

app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'usuario']);

    body.idUsuario = req.usuario._id;



    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true },
        (err, productoDB) => {

            if (err) return utiles.respuesta(400, { err: { message: 'No existe una categoria con ese id' } }, res)

            productoDB.disponible = true;

            res.json({
                ok: true,
                producto: productoDB,
            })
        })


});

app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: false },
        (err, productoBorrado) => {
            if (err) return utiles.respuesta(400, err, res);

            if (!productoBorrado) return utiles.respuesta(404, { message: 'Este producto no existe' }, res);

            if (!productoBorrado.disponible) return utiles.respuesta(404, { err: { message: 'Este producto fué eliminado' } }, res);

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto eliminado'
            })



        })

});


module.exports = app;