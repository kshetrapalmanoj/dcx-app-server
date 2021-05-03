//Schemas
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

//Auth Routes
//Register new developer
/**
 * @swagger
 *  api/developer/register:
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

//Get all developers
/**
* @swagger
*  api/developer/:
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

//User Login
/**
* @swagger
*  api/developer/login:
*   post:
*     summary: For User login
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
*           properties:
*             email:
*               type: string
*             password:
*               type: string
*           example:
*              {
*                  "email" : "someone@examples.com",
*                  "password" : "secure hashed password"
*              }
*     responses:
*       200:
*         description: Returns Jwt Token
*       400:
*         description: Invalid Credentials
*/

//Contact Routes
/**
 * @swagger
 *  api/contact/register:
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
 *                  "name":"John Doe",
 *                  "email":"john@examples.com",
 *                  "phone":"9876543210",
 *                  "location":"Atlanta",
 *                  "budget":"35000 Dollars",
 *                  "website":"www.example.com"
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

//Dashboard Routes
/**
* @swagger
 * api/verify/data  :
 *   get:
 *     summary: Validation of User JWT Token
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: token
 *         description: For passing JWT Token.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Valid Token and details of user
 *       400:
 *         description: Invalid Token
 *       401:
 *         description: Access Denied
 *
 */