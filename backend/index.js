/**
 * index.js
 *
 * A lightweight Node.js + NeDB backend for storing contacts.
 * 
 * - Uses NeDB for local file-based persistence.
 * - Provides CRUD operations (Create, Read, Delete) via a REST API.
 */

const express = require('express');
const cors = require('cors');
const Datastore = require('nedb');

const app = express();
const PORT = 3001;

/**
 * Middleware
 */
app.use(cors());          // Enable Cross-Origin Resource Sharing
app.use(express.json());  // Parse JSON bodies from incoming requests

/**
 * Initialize NeDB:
 * - Stores data in "contacts.db"
 * - Automatically loads any existing data from the file.
 */
const db = new Datastore({ filename: 'contacts.db', autoload: true });

/**
 * CREATE (Add) a new contact
 */
app.post('/api/contacts', (req, res) => {
  const { name, email } = req.body;

  // Basic validation: Both name and email must be provided
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and Email are required.' });
  }

  // Check for duplicate by email
  db.findOne({ email }, (findErr, existingContact) => {
    if (findErr) {
      console.error(findErr);
      return res.status(500).json({ message: 'Failed to check for duplicate contact.' });
    }
    if (existingContact) {
      return res.status(409).json({ message: 'Contact already exists.' });
    }

    // Insert into NeDB
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
 * READ (Get) all contacts, with optional search
 */
app.get('/api/contacts', (req, res) => {
  // If a 'query' parameter exists, we'll search by name or email
  const { query } = req.query;
  let searchParams = {};

  if (query) {
    // Create a case-insensitive regex for partial matches
    const regexQuery = new RegExp(query, 'i');
    searchParams = { $or: [{ name: regexQuery }, { email: regexQuery }] };
  }

  // Retrieve matching contacts from NeDB
  db.find(searchParams, (findErr, docs) => {
    if (findErr) {
      console.error(findErr);
      return res.status(500).json({ message: 'Failed to retrieve contacts.' });
    }
    return res.json(docs);
  });
});

/**
 * DELETE a contact by email
 */
app.delete('/api/contacts/:email', (req, res) => {
  const { email } = req.params;

  // Remove any docs matching this email
  db.remove({ email }, {}, (removeErr, numRemoved) => {
    if (removeErr) {
      console.error(removeErr);
      return res.status(500).json({ message: 'Failed to delete contact.' });
    }
    // If no documents were removed, then no matching contact was found
    if (numRemoved === 0) {
      return res.status(404).json({ message: 'Contact not found.' });
    }
    return res.json({ message: 'Contact deleted successfully.' });
  });
});

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
