const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

//routes required
const authRoute = require('./routes/authRoute');
const verifyRoute = require('./routes/dashboard');
const contactRoute = require('./routes/contactRoute');

//managing environment variables
dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("Connected to DB");
})

app.use(cors());
//Middleware

app.use(express.json());

//Middleware Route
app.use('/api/developer', authRoute);
app.use('/verify', verifyRoute);

app.use('/api/contact', contactRoute);
app.get('/', (req, res) => {
  res.send('Welcome! This is the DCX Developer Directory App')
})


app.listen(3000, () => console.log("Server is running at 3000"))
