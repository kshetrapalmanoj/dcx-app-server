const mongoose = require('mongoose');
const contactScheme = new mongoose.Schema({
    full_name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phoneno:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    budget:{
      type:String,
      required:true
    },
    website:{
      type:String,
      required:true
    },
    startDate:{
      type:String,
      required:true
    },
    pages:{
      type:String,
      required:true
    },
    color:{
      type:String,
      required:true
    }

});

module.exports  = mongoose.model('contacts',contactScheme);
