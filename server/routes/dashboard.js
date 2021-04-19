const router = require('express').Router();
const Developer = require('../model/Developer');
const jwt = require('jsonwebtoken');


router.get('/data',verify,(req,res)=>{
    Developer.findById({_id:decodedData._id},(error,data)=>{
        return res.status(200).json({full_name:data});
    });
})
let decodedData = "";

function verify(req,res,next){
    const token = req.query.token;
    if (!token) return res.status(400).send({message:'Access Denied'});

    try {
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        decodedData = verified;
        next();
    } catch (error) {
        return res.status(400).json({message:'Invalid token'});
    }
}

module.exports = router;
