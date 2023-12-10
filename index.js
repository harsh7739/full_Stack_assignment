const express = require("express")
const cors = require("cors")
const { connection } = require("./db")
const { userRouter } = require("./routes/user.route")
const { noteRouter } = require("./routes/note.route")


const app = express()
app.use(express.json())
app.use(cors())


// app.use("/",(req,res)=>{
//     res.send("Home Page...")
// })

app.use("/users",userRouter)
app.use("/notes",noteRouter)

app.listen(8080,async()=>{
   try {
    await connection
    console.log("Connected to DB..")
    console.log("Server is running...")
   } catch (error) {
    console.log(error)
   }
})
module.exports=app