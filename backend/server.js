require('dotenv').config();
const express = require('express');
const cors = require('cors');
const DatabaseConnection=require('./config/database');


const app = express();
app.use(cors());
app.use(express.json());

DatabaseConnection()






const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
