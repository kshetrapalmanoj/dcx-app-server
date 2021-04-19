const router = require('express').Router();
const Contact = require('../model/Contact');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register',async (req,res)=>{

    const contact = new Contact({
        full_name:req.body.full_name,
        email:req.body.email,
        phoneno:req.body.phoneno,
        location:req.body.location,
        budget:req.body.budget,
        website:req.body.website,
        startDate:req.body.startDate,
        pages:req.body.pages,
        color:req.body.color
    });
    try {

        const developerSave = await contact.save();
        res.send({contact: contact._id});

    } catch (error) {
        res.status(400).send(error)
    }
});

router.get('/', (req, res) => {
  Contact.find((err, docs) => {
      if (!err) { res.send(docs); }
      else { console.log('Error in Retrieving Data :' + JSON.stringify(err, undefined, 2)); }
  });
});



module.exports = router;
