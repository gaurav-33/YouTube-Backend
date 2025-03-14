import dotenv from "dotenv"
import { app } from "./app.js"
import connectDB from "./db/index.js"
dotenv.config({ path: './.env' })


connectDB()
    .then(() => {
        app.on("error", () => {
            console.log("APP ERROR: ", err)
            throw err
        })
        app.listen(process.env.PORT || 8000, () => {
            console.log(`👉  Server is running at port: ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("MONGO DB connection failed !! ", err)
    })




/*import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
dotenv.config()
const app = express()
;(async ()=> {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", ()=>{
            console.log("ERROR: ", error)
            throw error
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})() */