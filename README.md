This is the backend server for the Syncthreads Map App, built using **Node.js**, **Express.js**, and **SQLite**. It provides RESTful APIs for user authentication and interactive map features.

## 🚀 Features
- User Authentication (JWT-based)
- Secure API Endpoints
- Interactive Dashboard
- Map Integration

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Authentication:** JWT (JSON Web Token)

---

## 📌 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/syncthreads-map-backend.git
cd syncthreads-map-backend
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add the following:
```
PORT=3000
JWT_SECRET=your_secret_key
DB_PATH=./backend.db
```

### 4️⃣ Start the Server
```sh
npm start
```
Server runs on `http://localhost:3000`.

---

## 📡 API Endpoints

### 🔐 Authentication
#### Register a User
```http
POST /users/register
```
**Request Body:**
```json
{
  "username": "user1",
  "password": "password123"
}
```

#### Login a User
```http
POST /users/login
```
**Request Body:**
```json
{
  "username": "user1",
  "password": "password123"
}
```
**Response:**
```json
{
  "token": "your_jwt_token_here"
}
```

### 📊 Dashboard
#### Get Dashboard Data
```http
GET /users/dashboard
Headers: { Authorization: Bearer <jwt_token> }
```
**Response:**
```json
{
  "username": "user1",
  "cards": [
    { "id": 1, "title": "New Delhi Overview", "description": "Explore the heart of India." },
    { "id": 2, "title": "India Gate", "description": "Discover the iconic war memorial." },
    { "id": 3, "title": "Red Fort", "description": "A UNESCO World Heritage Site." }
  ]
}
```

### 🗺️ Map API
#### Get Map Data
```http
GET /users/map
Headers: { Authorization: Bearer <jwt_token> }
```
**Response:**
```json
{
  "center": [20.5937, 78.9629],
  "zoom": 5
}
```

---

## 🛠️ Development
### Run Server in Development Mode
```sh
npm run dev
```

### Run Database Migrations
If using migrations for SQLite, run:
```sh
npm run migrate
```

---

## 📜 License
This project is open-source and available under the MIT License.

