
//╔══════════╦════════════════════════════════════════════╗
//║          ║ PUERTO
//╠══════════╬════════════════════════════════════════════╣
//╚══════════╩════════════════════════════════════════════╝

process.env.PORT = process.env.PORT || 3000

//╔══════════╦════════════════════════════════════════════╗
//║          ║ ENTORNO
//╠══════════╬════════════════════════════════════════════╣
//╚══════════╩════════════════════════════════════════════╝

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //NODE_ENV LO CREA HEROKU

//╔══════════╦════════════════════════════════════════════╗
//║          ║ BASE DE DATOS
//╠══════════╬════════════════════════════════════════════╣
//╚══════════╩════════════════════════════════════════════╝
// contraseña y usuario del admin de la db
//urlDb = 'mongodb+srv://santxiki:Sakaneta_22_151113@cluster0-jst72.mongodb.net/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=true';

if (process.env.NODE_ENV === 'dev'){
    urlDb = 'mongodb://localhost:27017/cafe';
}else{
    urlDb = 'mongodb+srv://nodeUser:zhqhqZiNBTnsx0t9@cluster0-jst72.mongodb.net/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
}

process.env.URL_DB = urlDb;



