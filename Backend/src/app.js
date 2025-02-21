import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials: true
}))

//use to allow express to share json data across server
app.use(express.json({limit:"16kb"}))

//used to specofy url encodings in express , eg:specify if url includes objects etc.
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))

//informs express about the location of static resources like images
app.use(express.static("public"))

//allows devs to use the cookies and insert secure cookies in request
app.use(cookieParser())

//routes import
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import healthCheckRouter from "./routes/healthcheck.routes.js"
//routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/health-check",healthCheckRouter)
export { app }