const express = require('express');

const { verificaToken, verificaAdmin } = require('../middlewares/autenticacion');

const _ = require('underscore');

let app = express();

let Producto = require('../models/producto');

// ============================
// Obtener Productos
// ============================

app.get('/productos', verificaToken, (req, res) => {
    // trae toddos los productos
    // populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .skip(desde)
        .limit(limite)

    .exec((err, productos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos
        });

    })


});

// ============================
// Obtener un Producto por ID
// ============================

app.get('/productos/:id', (req, res) => {
    // populate: usuario categoria

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    })

});

// ============================
// Hacer una Busqueda
// ============================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        })

})

// ============================
// Crear un nuevo producto
// ============================

app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    //grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });


});

// ============================
// Actualizar un Producto
// ============================

app.put('/productos/:id', verificaToken, (req, res) => {
    // actualizar un producto
    let id = req.params.id;
    let body = req.body;

    let productoMod = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    }

    Producto.findByIdAndUpdate(id, productoMod, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    });


});


// ============================
// Borrar un Producto
// ============================
app.delete('/productos/:id', [verificaToken, verificaAdmin], (req, res) => {
    // deshabilitar un producto
    let id = req.params.id;
    let body = _.pick(req.body, ['disponible']);

    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            producto: productoBorrado
        })

    })

});




module.exports = app;