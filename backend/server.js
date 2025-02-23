// backend/index.js

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const sqlconnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Replace with your MySQL password
  database: "chatbot_data"
});

sqlconnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL Database:', err);
  } else {
    console.log('Connected to MySQL Database successfully');
  }
});

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gauravgupta58562@gmail.com', // Replace with your Gmail
    pass: "ekqt vnmj rtke jgyh" // Use App Password
  }
});

// API Route to Insert Data and Send Email
app.post('/', (req, res) => {
  const { name, email, contact, selectedCourse } = req.body;

  // Validate Input
  if (!name || !email || !contact || !selectedCourse) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Insert Data into MySQL
  const query = "INSERT INTO user_details (name, email, contact, selectedCourse) VALUES (?, ?, ?, ?)";
  sqlconnection.query(query, [name, email, contact, selectedCourse], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('Data inserted with ID:', result);

    // Email Content
    const mailOptions = {
      from: 'gauravgupta58562@gmail.com',
      to: email,
      subject: 'Course Selection Confirmation',
      text: `Hello ${name},\n\nThank you for selecting the ${selectedCourse} course. Our team will reach out to you at ${contact} soon.\n\nBest regards,\nYour Chatbot Team`
    };

    // Send Email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Data inserted and email sent successfully' });
      }
    });
  });
});

// Test Route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});