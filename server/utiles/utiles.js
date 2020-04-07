let respuesta = (status, err, res) => {
    res.status(status).json({
        ok: false,
        err: err
    });
}
let mensaje = (msj) => {
    console.log();
}

module.exports = {
    respuesta,
    mensaje
}