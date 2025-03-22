const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Temporary in-memory storage
let contacts = [];

// Routes
app.post('/api/contacts', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and Email are required.' });
  }

  // Check for duplicates
  const existingContact = contacts.find(
    (contact) => contact.email === email
  );
  if (existingContact) {
    return res.status(409).json({ message: 'Contact already exists.' });
  }

  const newContact = { name, email };
  contacts.push(newContact);
  res.status(201).json({ message: 'Contact added successfully', newContact });
});

app.get('/api/contacts', (req, res) => {
  const { query } = req.query;
  if (query) {
    // Simple search by name OR email
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.email.toLowerCase().includes(query.toLowerCase())
    );
    return res.json(filtered);
  }
  // Return all contacts
  res.json(contacts);
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});