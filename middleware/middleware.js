const jwt = require("jsonwebtoken");
module.exports = middleware = (req, res, next) => {
    if(req.headers && req.headers.authorization){
      
         jwt.verify(req.headers.authorization.replace("Bearer ",""), 'secretkeyappearshere',(err)=>{
            if(err){
                  return res.status(403).json({ status: false, message:err.message });
            }
            else{
                next();
            }
         });
      }

    else{
      return res.status(403).json({ status: false, message:'invalid token' });
    }

}