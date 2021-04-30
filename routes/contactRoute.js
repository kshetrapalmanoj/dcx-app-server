const router = require('express').Router();
const Contact = require('../model/Contact');

router.post('/register', async (req, res) => {

  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    location: req.body.location,
    budget: req.body.budget,
    website: req.body.website,
  });
  try {

    const developerSave = await contact.save();
    res.send({ contact: contact._id });

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
