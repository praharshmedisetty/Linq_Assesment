import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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
    }
  };

  // POST request to add a new contact
  const addContact = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Name and Email are required!');
      return;
    }
    try {
      await axios.post('http://localhost:3001/api/contacts', { name, email });
      setName('');
      setEmail('');
      // Refresh the list (without search filter)
      fetchContacts('');
      setSearchQuery(''); // Also reset the search bar if desired
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1>Contact Manager</h1>
      </header>

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

      {/* Search container (no search button) */}
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
              <strong>Name:</strong> {contact.name} &nbsp;|&nbsp; 
              <strong>Email:</strong> {contact.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;