# BudgetTrack — Budget Tracking REST API

BudgetTrack is a full-stack budget tracking web application that helps users manage income, expenses, and financial transactions. It uses React for the frontend, Node.js and Express.js for the REST API, and MongoDB Atlas for persistent data storage.

## Live Application

- **Frontend:** https://frontend-anil-add5.vercel.app
- **Backend API:** https://budget-tracking-api-voai.onrender.com
- **GitHub Repository:** https://github.com/anil-4115/budget-tracking-api

## Features

- Add income and expense transactions.
- View all recorded transactions.
- Retrieve individual transactions by ID.
- Update existing transaction details.
- Delete transactions.
- Store transaction data in MongoDB Atlas.
- View income, expenses, and current balance on the dashboard.
- Search and filter transaction records.
- Deploy the frontend and backend using cloud hosting services.

## Technologies Used

| Component | Technology |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| API Testing | Postman |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git and GitHub |

## Project Structure

```text
budget-tracking-api/
├── backend/
│   ├── server.js
│   ├── Transaction.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── .gitignore
```

*Adjust the structure if your actual repository contains different files.*

## REST API Endpoints

**Base URL:** `https://budget-tracking-api-voai.onrender.com`

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API status |
| POST | `/api/transactions` | Create a transaction |
| GET | `/api/transactions` | Retrieve all transactions |
| GET | `/api/transactions/:id` | Retrieve a transaction by ID |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

### Example: Create a Transaction

**Request URL**

`https://budget-tracking-api-voai.onrender.com/api/transactions`

**Method:** `POST`

**Request Body (JSON)**

```json
{
  "title": "Freelance Payment",
  "amount": 25000,
  "type": "income",
  "category": "Salary",
  "date": "2026-10-22",
  "description": "Freelance project payment"
}
```

The request fields must match the schema implemented in `Transaction.js`.

## Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB Atlas account
- Git
- Postman

### 1. Clone the Repository

```bash
git clone https://github.com/anil-4115/budget-tracking-api.git
cd budget-tracking-api
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=3000
```

Replace the placeholder with your own MongoDB Atlas connection string. Never commit your actual `.env` file or database credentials to GitHub.

### 4. Start the Backend Locally

```bash
npm start
```

If your `package.json` does not define a start script, run:

```bash
node server.js
```

The backend should run at `http://localhost:3000`.

### 5. Start the Frontend Locally

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite.

## Database Integration

MongoDB Atlas stores transaction records, while Mongoose defines the transaction model and handles database operations. Transactions created or modified through the application are persisted in the database.

## Deployment

- **Frontend:** Vercel
- **Backend REST API:** Render
- **Database:** MongoDB Atlas

The deployed frontend communicates with the public backend URL rather than `localhost`.

## API Testing with Postman

The API can be tested using Postman against the deployed backend:

1. **POST** — Create a transaction.
2. **GET** — Retrieve all transactions.
3. **GET by ID** — Retrieve a specific transaction.
4. **PUT** — Update a transaction.
5. **DELETE** — Delete a transaction.

Include screenshots of the requests, response bodies, and HTTP status codes in the project report after completing the tests.

## Conclusion

BudgetTrack demonstrates a full-stack budget management application with RESTful CRUD operations, MongoDB database integration, and cloud deployment. It provides practical experience with Express.js API development, React frontend development, database persistence, and web hosting.

## Author

**Anil Verma**

GitHub: https://github.com/anil-4115
