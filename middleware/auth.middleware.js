const jwt = require("jsonwebtoken")

const auth =  (req,res,next)=>{
const token = req.headers.authorization?.split(" ")[1]
console.log("token is",token)
if(token){
    jwt.verify(token,"masai",(err,decoded)=>{
        console.log(decoded)
        if(decoded){
            req.body.userID = decoded.userID;
            req.body.username=decoded.username
            next()
        }else{
            res.send({"msg":"You are not authorised"})
        }
    })
}else{
    console.log("token is not available")
    res.send({"msg":"You are not authorised..."})
}
}

module.exports={auth}