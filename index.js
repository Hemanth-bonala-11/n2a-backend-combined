const express = require('express');
app = express()

const userRoutes = require('./routes/User')
const paymentRoutes = require('./routes/Payment')
const courseRoutes = require('./routes/Course')
const profileRoutes = require('./routes/Profile')

const database = require('./config/database')
const cloudinary = require('./config/cloudinary');
const multiTenant = require('./controllers/MultiTenancy')
const cookieParser = require('cookie-parser')

const cors = require('cors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv')
dotenv.config()

const port = process.env.PORT || 2000


database.dbConnect();
cloudinary.cloudinaryConnect()

app.use(express.json());
app.use(cookieParser());

// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true
// }))

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/"
}))


app.use("/api/v1/user", userRoutes);
app.use("api/v1/profile", profileRoutes);
app.use("api/v1/payment", paymentRoutes);
app.use("api/v1/course", courseRoutes);
app.get(/^(.*)\/?$/, multiTenant.renderTemplate);

app.listen(port, ()=>{
    console.log("server is running at port ", port)
})

app.get("/",(req,res)=>{
    console.log(req.get('host'));
    return res.json({
        "message": "Hello world this is first step"
    })
})