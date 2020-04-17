const jwt = require('jsonwebtoken')
const utiles = require('../utiles/utiles');
// require('../config/config');

// ================ //
// Verificar token //
// ================ //

let verificador = (req, res, next, token) => {

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {

        if (err) return utiles.respuesta(401, { err: { mensaje: 'Token no válido' } }, res);

        req.usuario = decoded.usuario;

        next()

    });

}

let verificaToken = (req, res, next) => {

    let token = req.get('token');
    // lo agarra del header

    verificador(req, res, next, token);

};

// ================ //
// Verificar ADMIN//
// ================ //

let verificaAdminRol = (req, res, next) => {

    let usuario = req.usuario; // Este req viene del verificador de token con decoded

    if (usuario.role != 'ADMIN_ROLE') return utiles.respuesta(401, { err: { mensaje: 'No tiene derechos de administrador' } }, res);

    next();
};

// ================ //
// Verificar token img//
// ================ //

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    verificador(req, res, next, token);

}


module.exports = {
    verificaToken,
    verificaAdminRol,
    verificaTokenImg
}