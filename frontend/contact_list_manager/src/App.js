/**
 * App.js
 *
 * A simple React application that interacts with the Node.js + NeDB backend.
 * - Allows adding, displaying, searching, and deleting contacts.
 * - Uses Axios for HTTP requests.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  /**
   * State Variables
   */
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Load contacts whenever the searchTerm changes.
   */
  useEffect(() => {
    loadContacts(searchTerm);
  }, [searchTerm]);

  /**
   * Fetch contacts from the server (with optional query filter).
   */
  const loadContacts = async (term) => {
    try {
      // Append '?query=...' if a search term is provided
      const queryParam = term ? `?query=${term}` : '';
      const response = await axios.get(`http://localhost:3001/api/contacts${queryParam}`);
      setContacts(response.data);
    } catch (error) {
      console.error('Error loading contacts:', error);
      setErrorMessage('Failed to load contacts. Please try again later.');
    }
  };

  /**
   * Basic email validation with a simple regex.
   * Adjust as needed for more robust validation.
   */
  const isEmailValid = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  /**
   * Handle adding a new contact (form submission).
   */
  const handleAddContact = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Clear any previous error

    // Check for empty fields
    if (!contactName.trim() || !contactEmail.trim()) {
      setErrorMessage('Name and Email are required.');
      return;
    }

    // Validate email format
    if (!isEmailValid(contactEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Attempt to add the contact
    try {
      await axios.post('http://localhost:3001/api/contacts', {
        name: contactName,
        email: contactEmail,
      });

      // Clear form inputs
      setContactName('');
      setContactEmail('');
      // Reset search & refresh the contact list
      setSearchTerm('');
      loadContacts('');
    } catch (err) {
      console.error('Error adding contact:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('An unexpected error occurred while adding the contact.');
      }
    }
  };

  /**
   * Handle deleting a contact by email.
   */
  const handleDeleteContact = async (email) => {
    // Confirmation dialog before deletion
    const confirmed = window.confirm('Are you sure you want to delete this contact?');
    if (!confirmed) return;

    setErrorMessage('');
    try {
      await axios.delete(`http://localhost:3001/api/contacts/${email}`);
      // Refresh the contact list with the current searchTerm
      loadContacts(searchTerm);
    } catch (err) {
      console.error('Error deleting contact:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('An unexpected error occurred while deleting the contact.');
      }
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Contact Manager</h1>
      </header>

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleAddContact}>
          <input
            type="text"
            placeholder="Enter Name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter Email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
          <button type="submit">Add Contact</button>
        </form>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Name or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="contact-list">
        <h2>Contact List</h2>
        <ul>
          {contacts.map((contact, index) => (
            <li key={index}>
              <div className="contact-name">
                <strong>Name:</strong> {contact.name}
              </div>
              <div className="contact-email">
                <strong>Email:</strong> {contact.email}
              </div>
              <button
                className="delete-button"
                onClick={() => handleDeleteContact(contact.email)}
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
