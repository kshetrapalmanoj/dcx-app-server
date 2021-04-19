const mongoose = require('mongoose');
const developerScheme = new mongoose.Schema({
    full_name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    group:{
        type:String,
        required:true
    }
});

module.exports  = mongoose.model('developers',developerScheme);
