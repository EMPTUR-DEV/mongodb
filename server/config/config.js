//=========// 
//Puerto //
//=========//
process.env.PORT = process.env.PORT || 3000;
loopEncPass = 10;

//=========// 
//Entorno //
//=========//

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//======================// 
// Variables del token //
//=====================//

// Vencimiento 
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
// seed
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'seed-desarrollo';


//===============// 
// Base de datos //
//===============//

let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';

} else {
    urlDB = process.env.MONGO_DB;
}

// process.env.URLDB = urlDB;

process.env.URLDB = 'mongodb+srv://tempweb:Avarot.JBL@cluster0-oleuc.mongodb.net/cafe';

//=====================//
//  Google client id   //
// ====================//
process.env.CLIENT_ID = process.env.CLIENT_ID || '917800431712-cgvqelvaovtpv8770bdjug118meicf2q.apps.googleusercontent.com'