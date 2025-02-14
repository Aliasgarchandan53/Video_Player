import dotenv from "dotenv"
import connectDB from "./db/index.js";
import express from "express"
import { app } from "./app.js";

dotenv.config({
    path:'./.env'
})
connectDB()
.then(()=>{
    app.on("error",(err)=>{
        console.log("DB server error : ",err)
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Sever is running at port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MongoDB connection error : ",err)
})

/*
//approach 1
import express from "express"

const app = express()

(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERROR : ",error)
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR : ",error)
        throw err
    }
})()
*/