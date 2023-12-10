const express=require("express")
const { auth } = require("../middleware/auth.middleware")
const { NoteModel } = require("../model/note.model")

const noteRouter=express.Router()

noteRouter.get("/",auth,async(req,res)=>{
    try {
        const note = await NoteModel.find({userID:req.body.userID})
        if(note){
            res.status(200).send(note)
        }else{
            res.status(200).send({"mag":"Notes are not available..."})
        }
    } catch (error) {
        res.status(400).send({"err":error})
    }
})

noteRouter.post("/create",auth,async(req,res)=>{
    try {
        const note = new NoteModel(req.body)
        await note.save()
        res.status(200).send({"msg":"New note has been created"})
    } catch (error) {
        res.status(400).send({"err":error})
    }
})

noteRouter.patch("/update/:id",auth,async(req,res)=>{
    const {id}=req.params
    try {
        const note = await NoteModel.findOne({_id:id})
        if(req.body.userID==note.userID){
            await NoteModel.findByIdAndUpdate({_id:id},req.body)
            res.status(200).send({"msg":"Note has been updated"})
        }else{
            res.status(200).send({"msg":"You are not authorised"})
        }
    } catch (error) {
        res.status(400).send({"err":error})
    }
})

noteRouter.delete("/delete/:id",auth,async(req,res)=>{
    const {id}=req.params
    try {
        const note = await NoteModel.findOne({_id:id})
        if(req.body.userID==note.userID){
            await NoteModel.findByIdAndDelete({_id:id})
            res.status(200).send({"msg":"Note has been deleted"})
        }else{
            res.status(200).send({"msg":"You are not authorised"})
        }
    } catch (error) {
        res.status(400).send({"err":error})
    }
})

module.exports={noteRouter}