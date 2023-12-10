const express=require("express")
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken")
const { UserModel } = require("../model/user.model")

const userRouter=express.Router()


userRouter.post("/register",async(req,res)=>{
    const {username,email,pass}=req.body
    try {
        const user= await UserModel.findOne({email})
        if(user){
            res.status(200).send({"msg":"User already exist..."})
        }else{
            if(checkPass(pass)){
                bcrypt.hash(pass,5,async(err,hash)=>{
                    if(err){
                     res.status(200).send({"msg":"password cannot hash..."})
                    }else{
                     const user=new UserModel({username,email,pass:hash})
                     await user.save()
                     res.status(200).send({"msg":"Registration Successfull..."})
                    }
                 })
            }else{
                res.status(200).send({"msg":"Password should be atleast of 8 characters length and atleast one uppercase, one number, one special symbol"})
            }
        }
    } catch (error) {
        res.status(400).send({"err":error})
    }
})


userRouter.post("/login",async(req,res)=>{
 const {username,email,pass}=req.body
 try {
    const user = await UserModel.findOne({email})
    if(user){
        bcrypt.compare(pass, user.pass, (err, result)=> {
           if(result){
                const token = jwt.sign({userID:user._id,username:user.username},"masai",{expiresIn:"7d"})
                res.status(200).send({"msg":"Login Successfull",token})
           }else{
            res.status(200).send({"msg":"Wrong Credential"})
           }
        });
    }else{
        res.status(200).send({"msg":"You haven't account Please Register First"})
    }
 } catch (error) {
    res.status(400).send({"error":error})
 }
})


function checkPass(pass){
    if(pass.length<8){
        return false
    }
    let flag1 = true;
    let flag2 = true;
    let flag3 = true;
    let alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let num = "0123456789";
    let spec = "~!@#$%^&*()_+-=[]{}"
    for(let i=0;i<pass.length;i++){
        if(alpha.includes(pass[i])){
            flag1=true
        }
        if(num.includes(pass[i])){
            flag2=true
        }
        if(spec.includes(pass[i])){
            flag3=true
        }
    }
    if(flag1 && flag2 && flag3){
        return true
    }else{
        return false
    }
}

module.exports={userRouter}