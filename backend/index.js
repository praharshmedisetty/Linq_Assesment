const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage of contacts
const contacts = [];

// Create (Add) a new contact
app.post('/api/contacts', (req, res) => {
  const { name, email } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and Email are required.' });
  }

  // Check for duplicates by email
  const duplicate = contacts.find((contact) => contact.email === email);
  if (duplicate) {
    return res.status(409).json({ message: 'Contact already exists.' });
  }

  const newContact = { name, email };
  contacts.push(newContact);
  return res.status(201).json({
    message: 'Contact added successfully',
    newContact,
  });
});

// Read (Get) all contacts, with optional search
app.get('/api/contacts', (req, res) => {
  const { query } = req.query;
  if (query) {
    const filteredContacts = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.email.toLowerCase().includes(query.toLowerCase())
    );
    return res.json(filteredContacts);
  }
  return res.json(contacts);
});

// Delete a contact by email
app.delete('/api/contacts/:email', (req, res) => {
  const { email } = req.params;
  const index = contacts.findIndex((contact) => contact.email === email);

  if (index === -1) {
    return res.status(404).json({ message: 'Contact not found.' });
  }

  contacts.splice(index, 1);
  return res.json({ message: 'Contact deleted successfully.' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
