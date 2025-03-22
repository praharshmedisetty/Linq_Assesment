import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(''); // To display error messages in the UI

  // Fetch contacts when searchQuery changes or on initial load
  useEffect(() => {
    fetchContacts(searchQuery);
  }, [searchQuery]);

  // GET request to fetch contacts (with optional query)
  const fetchContacts = async (query) => {
    try {
      const queryParam = query ? `?query=${query}` : '';
      const response = await axios.get(`http://localhost:3001/api/contacts${queryParam}`);
      setContacts(response.data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch contacts. Please try again later.');
    }
  };

  // Validate email format (basic regex)
  const isValidEmail = (emailToTest) => {
    // Very simple pattern; adjust for more robust validation if desired
    return /^\S+@\S+\.\S+$/.test(emailToTest);
  };

  // POST request to add a new contact
  const addContact = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error message

    // Check for empty fields
    if (!name.trim() || !email.trim()) {
      setError('Name and Email are required.');
      return;
    }

    // Check email validity
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/contacts', { name, email });
      setName('');
      setEmail('');
      // Refresh the list (without search filter)
      fetchContacts('');
      setSearchQuery('');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred while adding the contact.');
      }
    }
  };

  // DELETE request to remove a contact by email
  const deleteContact = async (contactEmail) => {
    // Show a confirmation dialog first
    const confirmed = window.confirm('Are you sure you want to delete this contact?');
    if (!confirmed) return; // If user cancels, do nothing

    setError(''); // Clear any previous error message
    try {
      await axios.delete(`http://localhost:3001/api/contacts/${contactEmail}`);
      // Refresh the contact list
      fetchContacts(searchQuery);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred while deleting the contact.');
      }
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1>Contact Manager</h1>
      </header>

      {/* Error message display */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Form to add a new contact */}
      <div className="form-container">
        <form onSubmit={addContact}>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Add Contact</button>
        </form>
      </div>

      {/* Search container (no button) */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Name or Email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Contact list */}
      <div className="contact-list">
        <h2>Contact List</h2>
        <ul>
          {contacts.map((contact, idx) => (
            <li key={idx}>
              <div className="contact-name">
                <strong>Name:</strong> {contact.name}
              </div>
              <div className="contact-email">
                <strong>Email:</strong> {contact.email}
              </div>
              <button
                className="delete-button"
                onClick={() => deleteContact(contact.email)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
