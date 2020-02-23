const express = require('express');

let { verificaToken, verificaAdmin } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categorias');

// ============================
// Mostrar todas las Categorias
// ============================
app.get('/categorias', verificaToken, (req, res) => {

    Categoria.find({})
        .populate('usuario', 'nombre email')
        .sort('descripcion')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });

});

// ============================
// Mostrar una Categoria por ID
// ============================
app.get('/categorias/:id', verificaToken, (req, res) => {
    //findById
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// ============================
// Crear una nueva Categoria
// ============================
app.post('/categorias', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

    // Regresa la nueva categoria
    // req.usuario._id


});

// ============================
// Actualiza un Registro
// ============================
app.put('/categorias/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findOneAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });



    });


});

// ============================
// Borra un Registro
// ============================
app.delete('/categorias/:id', [verificaToken, verificaAdmin], (req, res) => {
    // solo un admministrador puede borrar
    // findByIdAndDelete

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ERROR!!!'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })

    });

});










module.exports = app;