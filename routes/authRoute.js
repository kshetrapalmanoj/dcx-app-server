const router = require('express').Router();
const Developer = require('../model/Developer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Register new developer
/**
*  @swagger
*    components:
*     schemas:
*       Developer:
*         type: object
*         required:
*           - full_name
*           - email
*           - password
*           - group
*         properties:
*           _id:
*             type: string
*             description: The auto-generated id of the user.
*           full_name:
*             type: string
*             description: The Full name of the user.
*           email:
*             type: string
*             description: The email of the user.
*           password:
*             type: string
*             description: The password of the user.
*           group:
*             type: boolean
*             description: User belongs to which group (admin/developer)
*           __v:
*             type: integer
*             description: The version of record.
*/

/**
 * @swagger
 * api/developer/register:
 *   post:
 *     summary: Returns the list of all the users
 *     tags: [Developer]
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to create.
 *         schema:
 *           type: application/json
 *           required:
 *             - email
 *             - password
 *             - full_name
 *             - group
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             full_name:
 *               type: string
 *             group:
 *               type: string
 *           example:
 *              {
 *                  "email" : "someone@examples.com",
 *                  "password" : "secure hashed password",
 *                  "full_name" : "John Doe",
 *                  "group" : "Admin"
 *              }
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Email Already Exists
 *         content:
 *           application/json:
 *             schema:
 *                  
 */
router.post('/register', async (req, res) => {

    //Checks email exists in db or not
    const emailExists = await Developer.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).json({ message: 'Email Already Exists' });

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //creating new developer
    const developer = new Developer({
        full_name: req.body.full_name,
        email: req.body.email,
        password: hashedPassword,
        group: req.body.group
    });
    try {
        //store data
        const developerSave = await developer.save();
        res.send({ developer: developer._id });

    } catch (error) {
        res.status(400).send(error)
    }
});

//gets developer data as per pagination offset
router.get('/register/:offset', async (req, res) => {
    const offset = parseInt(req.params.offset);
    const data = await Developer.find().skip(offset).limit(5);
    const count = await Developer.countDocuments();
    if (!data) return res.status(400).json({ message: "error" });
    if (data) return res.status(200).json({ result: data, no: count });

});

//get all developers (for testing with postman)
/**
 * @swagger
 * api/developer/:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Developer]
 *     responses:
 *       200:
 *         description: The list of all the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Developer'
 */
router.get('/', (req, res) => {
    Developer.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retrieving Developers :' + JSON.stringify(err, undefined, 2)); }
    });
});

//Login
/**
 * @swagger
 * api/developer/login:
 *   post:
 *     summary: User Login
 *     tags: [Authentication]
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Used by users to login.
 *         schema:
 *           type: application/json
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *           example:
 *              {
 *                  "email" : "someone@examples.com",
 *                  "password" : "secure password",
 *              }
 *     responses:
 *       200:
 *         description: It will return the JWT token
 *       400:
 *         description: Invalid Credentials             
 */
router.post('/login', async (req, res) => {
    console.log(req.body);

    //checks developer exists or not
    const developer = await Developer.findOne({ email: req.body.email });
    if (!developer) return res.status(400).json({ message: 'Invalid Credentials' });

    //checking password
    const validPassword = await bcrypt.compare(req.body.password, developer.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid Credentials' });

    //token associated with developer id gets generated
    const token = await jwt.sign({ _id: developer._id }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
    if (token) return res.status(200).json(token);
    console.log('Logged in')


})

module.exports = router;
