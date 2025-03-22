import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all contacts or search
  useEffect(() => {
    fetchContacts();
  }, [searchQuery]);

  const fetchContacts = async () => {
    try {
      // If searchQuery is not empty, pass it as a query param
      const queryParam = searchQuery ? `?query=${searchQuery}` : '';
      const response = await axios.get(`http://localhost:3001/api/contacts${queryParam}`);
      setContacts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addContact = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/contacts', { name, email });
      setName('');
      setEmail('');
      fetchContacts(); // refresh contact list
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h1>Contact Manager</h1>
      <form onSubmit={addContact}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Add Contact</button>
      </form>

      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h2>Contact List</h2>
      <ul>
        {contacts.map((contact, idx) => (
          <li key={idx}>
            {contact.name} ({contact.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;