# Posts API

A RESTful API built with Node.js, Express, and MongoDB for managing posts and user authentication.

## 📋 Features

- **User Authentication**: Secure JWT-based authentication system
- **CRUD Operations**: Complete Create, Read, Update, and Delete operations for posts
- **User Management**: User registration and login functionality
- **Protected Routes**: Middleware-based route protection
- **MongoDB Integration**: Mongoose ODM for database operations
- **Input Validation**: Request validation and error handling
- **RESTful Architecture**: Clean and organized API structure

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── constants.js      # Application constants
│   │   └── database.js        # Database configuration
│   ├── controllers/
│   │   ├── post.controller.js # Post business logic
│   │   └── user.controller.js # User business logic
│   ├── middlewares/
│   │   └── auth.middleware.js # JWT authentication middleware
│   ├── models/
│   │   ├── post.model.js      # Post schema
│   │   └── user.model.js      # User schema
│   ├── routes/
│   │   ├── post.route.js      # Post routes
│   │   └── user.route.js      # User routes
│   ├── app.js                 # Express app configuration
│   └── index.js               # Application entry point
├── .env                       # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/rvega1204/Backend-Node-Express.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/your-database-name
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/mydb` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/users/register` | Register a new user | No |
| POST | `/api/v1/users/login` | Login user | No |

### Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/posts` | Get all posts | No |
| GET | `/api/v1/posts/:id` | Get post by ID | No |
| POST | `/api/v1/posts` | Create a new post | Yes |
| PATCH | `/api/v1/posts/:id` | Update a post | Yes |
| DELETE | `/api/v1/posts/:id` | Delete a post | Yes |

## 🔑 Authentication

This API uses JWT (JSON Web Tokens) for authentication. 

### How to use:

1. **Register** a new user or **login** with existing credentials
2. The API will return a JWT token
3. Include the token in the **Authorization header** for protected routes:

```
Authorization: Bearer <your-jwt-token>
```

### Example Request (Protected Route)

```bash
curl -X POST http://localhost:4000/api/v1/posts \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "description": "My first post",
    "age": 25
  }'
```

## 📝 Usage Examples

### Register a User

```bash
POST /api/v1/users/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Login

```bash
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Create a Post (Protected)

```bash
POST /api/v1/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "megalita",
  "description": "megalitas post",
  "age": 70
}
```

### Update a Post (Protected)

```bash
PATCH /api/v1/posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "age": 75
}
```

### Delete a Post (Protected)

```bash
DELETE /api/v1/posts/:id
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### User Model

```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model

```javascript
{
  name: String (required),
  description: String,
  age: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🛡️ Middleware

- **authMiddleware**: Verifies JWT tokens for protected routes
- **Error Handling**: Global error handling for consistent error responses

## 🧪 Testing

You can test the API using:

- **Postman** or **Insomnia** (API clients)
- **Thunder Client** (VS Code extension)
- **curl** (command line)

## 🚦 Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Ricardo Vega
- GitHub: [@yourusername](https://github.com/rvega1204)

## 🙏 Acknowledgments

- Express.js documentation
- MongoDB documentation
- JWT.io for token information

---

**Note**: Make sure to never commit your `.env` file to version control. Keep your secrets safe!