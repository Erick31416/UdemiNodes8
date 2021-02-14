const { isAdmin, verificartoken, verificartoken_web } = require('../midelwares/autentificacion');

var opcionesMenu = [
    {
        'ruta': "/logout",
        'slug': "logOut"
    },
    {
        'ruta': "/crearEje",
        'slug': "Crear un ejercicio"
    },
    {
        'ruta': "/listaEje",
        'slug': "Ver la lista de ejercicios"
    },
    {
        'ruta': "/examentipozero",
        'slug': "Hacer el examen tipo"
    },
    {
        'ruta': "/examentipozeroo",
        'slug': "Crear Coleccion"
    }
];


module.exports = opcionesMenu;