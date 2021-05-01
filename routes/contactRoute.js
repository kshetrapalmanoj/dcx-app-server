const router = require('express').Router();
const Contact = require('../model/Contact');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
* @swagger
 * api/contact/register:
 *   post:
 *     summary: Saving contact details of clients
 *     tags: [Contact]
 *     parameters:
 *       - in: body
 *         name: contact
 *         description: The user to create.
 *         schema:
 *           type: application/json
 *           required:
 *             - name
 *             - email
 *             - phone
 *             - location
 *             - budget
 *             - website

 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *             location:
 *               type: string
 *             budget:
 *               type: string
 *             website:
 *               type: string
 *           example:
 *             {
 *            "name":"John Doe",
 *            "email":"john@examples.com",
 *            "phone":"9876543210",
 *            "location":"Atlanta",
 *            "budget":"35000 Dollars",
 *            "website":"www.example.com"
 *              }
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Contact Already Exists
 *         content:
 *           application/json:
 *             schema:
 *
 */
router.post('/register', async (req, res) => {

  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    location: req.body.location,
    budget: req.body.budget,
    website: req.body.website
  });
  try {

    const developerSave = await contact.save();
    res.send({ contact: contact._id });

  } catch (error) {
    res.status(400).send(error)
  }
});

//get all developers (for testing with postman)
/**
* @swagger
 * api/contact/:
 *   get:
 *     summary: Returns the contacts of all the clients
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: The contacts of all the clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Developer'
 */
router.get('/', (req, res) => {
  Contact.find((err, docs) => {
    if (!err) { res.send(docs); }
    else { console.log('Error in Retrieving Data :' + JSON.stringify(err, undefined, 2)); }
  });
});


module.exports = router;
