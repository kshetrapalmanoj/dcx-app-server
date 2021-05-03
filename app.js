const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

//routes required
//Swagger
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

//import routes
const authRoute = require('./routes/authRoute');
const verifyRoute = require('./routes/dashboard');
const contactRoute = require('./routes/contactRoute');

//managing environment variables
dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Connected to DB");
})

//Swagger-------------------------
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DCX Developer Directory API",
            version: "1.0.0",
            description: "This is a simple DCX Developer API made with Express and documented with Swagger",
        },
        servers: [
            {
                url: "http://localhost:3000/",
            },
        ],
    },
    apis: ["./api-docs/apis.js"],
};

const specs = swaggerJsDoc(options)
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(specs, { explorer: true }))
//-------------------------------

app.use(cors());
//Middleware

app.use(express.json());

//Middleware Route
app.use('/api/developer', authRoute);
app.use('/api/verify', verifyRoute);
app.use('/api/contact', contactRoute);

app.get('/', (req, res) => {
    res.send('Welcome! This is the DCX Developer Directory App')
})

app.listen(process.env.PORT || 3001, () => console.log(`Server is running at ${process.env.PORT || 3001}`))
