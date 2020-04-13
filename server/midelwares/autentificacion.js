
const jwt = require('jsonwebtoken');

//╔═══════════════════╦╗
//║  verificar tokken
//╚═══════════════════╩╝
let verificartoken = (req,res,next)=>{

    let token = req.get('token');//

    jwt.verify(token,process.env.SEMILLA,(err,decode)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err :{
                    'message':'token no valido'
                }
            });
        }
        req.usarioLog = decode.usuarioDb;// no tengo claro de donde sale ese usuariodb

        next();
    })
};

//╔══════════════════════╦╗
//║  verificar role admin
//╚══════════════════════╩╝
let isAdmin = (req,res,next)=>{

    userLog = req.usarioLog;

    if (userLog.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err :{
                'message':'No tiene permiso'
            }
        });
    }
    next();
};

module.exports = {
    verificartoken,
    isAdmin
}