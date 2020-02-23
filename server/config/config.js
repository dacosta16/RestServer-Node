//=================================
// Puerto 
//=================================


process.env.PORT = process.env.PORT || 3000;


//=================================
// Entorno
//=================================


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=================================
// Base de Datos
//=================================


let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'

} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;


//=================================
// Vencimiento del Token
//=================================


process.env.CADUCIDAD_TOKEN = '48h';


//=================================
// SEED de Autenticacion
//=================================


process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//=================================
// Google Client ID
//=================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '559442522264-ue5n5u8b7tbqbo1st5brsdghsod3i399.apps.googleusercontent.com';