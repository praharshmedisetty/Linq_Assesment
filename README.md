# Contact List Manager Assessment

This project is a simple Contact Manager application demonstrating how to create, read, and delete contacts in a lightweight Node.js + React stack. The backend originally used an in-memory array to store contacts but later moved to a minimal embedded NeDB database for data persistence without needing a heavyweight database server.

NOTE: VIDEO FILE PRESENT IN THE REPOSITORY TO SHOWCASE THE WORKING OF THE APP

---

## 🛠 Backend Instructions

### 1. Navigate to the backend folder
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```
This will install all necessary Node.js packages (e.g., `express`, `cors`, `nedb`).

### 3. Run the Server
```bash
npm start
```
The server will listen on **port 3001**.  
You should see a console message:
```
Backend server listening on port 3001
```

### 4. Test the Backend
Open a tool like **Postman** or your **browser** and visit:

```
http://localhost:3001/api/contacts
```

You will get a list of contacts (initially empty).

---

## 💻 Frontend Instructions

### 1. Navigate to the frontend folder
```bash
cd frontend/contact_list_manager
```

### 2. Install Dependencies
```bash
npm install
```
This will install React, Axios, and any other packages specified in `package.json`.

### 3. Run the React App
```bash
npm start
```
By default, React will launch on **port 3000**.  
Open your browser and go to:

```
http://localhost:3000
```

You should see the **Contact Manager interface**.

---

## 🧠 Short Explanation of the Approach

### Initial In-Memory Storage
- Initially, contacts were stored in a JavaScript array (in memory).
- This was simple but not persistent—data would be lost when the server restarted.
- Also inefficient for larger apps since it lacks indexing and proper querying.

### Switching to NeDB
- NeDB is an embedded NoSQL database.
- It stores data in a local file (`contacts.db`).
- Lightweight and suitable for small-scale apps or prototypes.
- Supports basic MongoDB-like operations (`insert`, `find`, `remove`).

### Why NeDB?
- **Lightweight & Easy**: No external DB server, just a file.
- **NoSQL**: JSON-like storage is perfect for Node.js.
- **Low Overhead**: Ideal for prototypes and small applications.

---

## ⚙️ If Data Grows

For large or production-scale applications, switch to more robust databases like:

- **MongoDB** (NoSQL)
- **PostgreSQL / MySQL** (SQL)

These offer:

- Better performance
- Support for transactions and advanced queries
- High scalability

---
