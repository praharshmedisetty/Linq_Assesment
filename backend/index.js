const express = require('express');
const cors = require('cors');
const Datastore = require('nedb');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize NeDB with a file named "contacts.db", and auto-load it.
const db = new Datastore({ filename: 'contacts.db', autoload: true });

/**
 * Create (Add) a new contact
 */
app.post('/api/contacts', (req, res) => {
  const { name, email } = req.body;

  // Check for empty fields
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and Email are required.' });
  }

  // Check for duplicates by email
  db.findOne({ email }, (findErr, existingContact) => {
    if (findErr) {
      console.error(findErr);
      return res.status(500).json({ message: 'Failed to check for duplicate contact.' });
    }
    if (existingContact) {
      return res.status(409).json({ message: 'Contact already exists.' });
    }

    // Insert new contact
    const newContact = { name, email };
    db.insert(newContact, (insertErr, insertedDoc) => {
      if (insertErr) {
        console.error(insertErr);
        return res.status(500).json({ message: 'Failed to add contact.' });
      }
      return res.status(201).json({
        message: 'Contact added successfully',
        newContact: insertedDoc,
      });
    });
  });
});

/**
 * Read (Get) all contacts, with optional search
 */
app.get('/api/contacts', (req, res) => {
  const { query } = req.query;
  // If there's a query, search by name OR email
  let searchParams = {};
  if (query) {
    const regexQuery = new RegExp(query, 'i'); // 'i' for case-insensitive
    searchParams = { $or: [{ name: regexQuery }, { email: regexQuery }] };
  }

  db.find(searchParams, (findErr, docs) => {
    if (findErr) {
      console.error(findErr);
      return res.status(500).json({ message: 'Failed to retrieve contacts.' });
    }
    return res.json(docs);
  });
});

/**
 * Delete a contact by email
 */
app.delete('/api/contacts/:email', (req, res) => {
  const { email } = req.params;
  db.remove({ email }, {}, (removeErr, numRemoved) => {
    if (removeErr) {
      console.error(removeErr);
      return res.status(500).json({ message: 'Failed to delete contact.' });
    }
    if (numRemoved === 0) {
      // No documents removed => no matching contact
      return res.status(404).json({ message: 'Contact not found.' });
    }
    return res.json({ message: 'Contact deleted successfully.' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});