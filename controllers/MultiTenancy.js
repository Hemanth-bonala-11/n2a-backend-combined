const path = require('path')
require('dotenv').config()

exports.renderTemplate = (req,res)=>{
    try {
        if(req.headers.host === process.env.COMPANY_URL || req.headers.host === `www.${process.env.COMPANY_URL}`){
            return res.sendFile(path.join(process.env.BASE_DIR, 'public/n2a/build/index.html'))
        }
        else if (req.headers.host === "portfolio.hemanthbonala.tech" || req.headers.host === "www.portfolio.hemanthbonala.tech"){
            return res.sendFile(path.join(process.env.BASE_DIR, 'public/portfolio/build/index.html'))
        }
        else{
            return res.sendFile(path.join(process.env.BASE_DIR, 'public/portfolio/build/index.html'))
        }
        
    } catch (error) {
        return res.json({
            "error": error.message
        })
    }
}