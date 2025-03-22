const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Temporary in-memory storage
let contacts = [];

// Add a new contact
app.post('/api/contacts', (req, res) => {
  const { name, email } = req.body;

  // Check for empty fields
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and Email are required.' });
  }

  // Check for duplicates
  const existingContact = contacts.find(contact => contact.email === email);
  if (existingContact) {
    return res.status(409).json({ message: 'Contact already exists.' });
  }

  // Add contact
  const newContact = { name, email };
  contacts.push(newContact);
  res.status(201).json({ message: 'Contact added successfully', newContact });
});

// Get all contacts (with optional search)
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

// Delete a contact by email
app.delete('/api/contacts/:email', (req, res) => {
  const { email } = req.params;
  const index = contacts.findIndex((contact) => contact.email === email);

  if (index === -1) {
    return res.status(404).json({ message: 'Contact not found.' });
  }

  contacts.splice(index, 1);
  res.json({ message: 'Contact deleted successfully.' });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
