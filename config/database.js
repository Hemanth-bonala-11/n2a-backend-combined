const mongoose = require('mongoose');
require('dotenv').config()

exports.dbConnect = ()=>{
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("Db connected successfully")
    }).catch((err)=>{
        console.log("db connection failed");
        console.error(err.message);
        process.exit(1);
    })
}
