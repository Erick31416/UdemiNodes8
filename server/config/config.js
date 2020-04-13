//╔══════════╦════════════════════════════════════════════╗
//║  PUERTO
//╚══════════╩════════════════════════════════════════════╝
process.env.PORT = process.env.PORT || 3000

//╔════════════════════════╦══════════════════════════════╗
//║  VENCIMIENTO DEL TOKEN
//╠════════════════════════╩═══════════╦══════════════════╣
//║   60'' * 60' * 24 horas * 30 dias 
//╚════════════════════════════════════╩══════════════════╝
process.env.CADUCIDAD_TOKEN = 60 *60 *24 *30;

//╔══════════╦════════════════════════════════════════════╗
//║  SEMILLA 
//╚══════════╩════════════════════════════════════════════╝
process.env.SEMILLA =  process.env.SEMILLA || 'alkapara_secret';

//╔══════════╦════════════════════════════════════════════╗
//║  ENTORNO
//╚══════════╩════════════════════════════════════════════╝
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //NODE_ENV LO CREA HEROKU

//╔══════════╦════════════════════════════════════════════╗
//║ BASE DE DATOS
//╚══════════╩════════════════════════════════════════════╝
// contraseña y usuario del admin de la db
//urlDb = 'mongodb+srv://santxiki:Sakaneta_22_151113@cluster0-jst72.mongodb.net/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=true';

if (process.env.NODE_ENV === 'dev'){
    urlDb = 'mongodb://localhost:27017/cafe';
}else{
    urlDb = process.env.MONGO_URI;
}

process.env.URL_DB = urlDb;



