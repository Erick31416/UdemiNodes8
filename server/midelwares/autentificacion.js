
const jwt = require('jsonwebtoken');

//╔═══════════════════╦╗
//║  verificar tokken
//╚═══════════════════╩╝
let verificartoken = (req,res,next)=>{

    jwt.verify(token,process.env.SEMILLA,(err,decode)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err :{
                    'message':'token no valido'
                }
            });
        }
        req.usarioLog = decode.usuarioDb;// no tengo claro de donde sale ese usuarioDb
        next();
    })
};
//╔═══════════════════╦╗
//║  verificar tokken imangen
//╚═══════════════════╩╝
let verificartokenImagen = (req,res,next)=>{

    //let token = req.body.idtoken;
    //let tipo = req.params.tipo;
    let token = req.query.token;
    

    jwt.verify(token,process.env.SEMILLA,(err,decode)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err :{
                    'message':'token no valido'
                }
            });
        }
        req.usarioLog = decode.usuarioDb;
        // no tengo claro de donde sale ese usuarioDb
        // respuesta: creo que lo saca de decodificar la info que hay en el jwt (jwebtoken)
        next();
    })
};

//╔══════════════════════╦╗
//║  verificar role admin
//╚══════════════════════╩╝
let isAdmin = (req,res,next)=>{

    usarioLog = req.usarioLog;

    if (usarioLog.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err :{
                'message':'No tiene permiso'
            }
        });
    }
    next();
};
//╔══════════════════════╦╗
//║  usuarioDb
//╚══════════════════════╩╝
let usuarioDb = (req,res,next)=>{

    usarioLog = req.usarioLog;

    if (usarioLog.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err :{
                'message':'No tiene permiso'
            }
        });
    }
    next();
};

//╔═══════════════════╦╗
//║  verificar tokken
//╚═══════════════════╩╝
let verificartoken_web = (req,res,next)=>{


    jwt.verify(req.session.token,process.env.SEMILLA,(err,decode)=>{
        console.log({err});
        if(err){
            return res.status(401).json({
                ok: false,
                err :{
                    'message':'token no valido'
                }
            });
        }
        req.usarioLog = decode.usuarioDb;// no tengo claro de donde sale ese usuarioDb
        next();
    })
};

module.exports = {
    verificartoken,
    isAdmin,
    verificartokenImagen,
    verificartoken_web
}