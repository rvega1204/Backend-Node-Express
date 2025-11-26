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
- **Comprehensive Testing**: >80% code coverage with Jest

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv
- **Testing**: Jest + Supertest

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
├── __tests__/                 # Test suite
│   ├── unit/
│   ├── utils/
│   ├── validation/
│   └── security/
├── jest.config.cjs            # Jest configuration
├── jest.setup.cjs             # Jest setup
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

This project includes a comprehensive test suite with >80% code coverage.

### Test Stack

- **Jest**: Testing framework
- **Supertest**: HTTP assertions for API testing
- **Mock-based**: Fast tests without database dependencies

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test auth.middleware.test.js
```

### Test Structure

```
__tests__/
├── example.test.js                      # Basic setup verification
├── unit/
│   ├── controllers/
│   │   └── post.controller.test.js      # Post CRUD operations
│   └── middleware/
│       └── auth.middleware.test.js      # JWT authentication
├── utils/
│   ├── jwt.utils.test.js                # Token operations
│   ├── http.helpers.test.js             # HTTP response helpers
│   ├── data.utils.test.js               # Data transformations
│   └── error.handling.test.js           # Error management
├── validation/
│   └── validation.test.js               # Input validation
└── security/
    └── security.test.js                 # Security features
```

### Test Coverage

Our test suite includes **175+ test cases** covering:

#### ✅ **Controller Tests** (~20 tests)
- `getAllPosts` - Retrieve all posts with error handling
- `getPostById` - Single post retrieval with 404 handling
- `createPost` - Post creation with validation
- `updatePost` - Post updates with partial data support
- `deletePost` - Post deletion with verification
- Edge cases and error scenarios (404, 400, 500)

#### ✅ **Authentication Middleware** (~25 tests)
- Valid JWT token verification
- Expired token rejection
- Invalid/malformed token handling
- Missing authorization headers
- User database lookup verification
- Edge cases (extra spaces, case sensitivity, empty tokens)

#### ✅ **JWT Utilities** (~15 tests)
- Token creation with payloads
- Token verification and decoding
- Expiration handling
- Secret key validation

#### ✅ **Validation Tests** (~20 tests)
- Required field validation
- Data type validation
- String length constraints
- Email format validation
- Password strength requirements

#### ✅ **Security Tests** (~25 tests)
- Password hashing (bcrypt)
- Password comparison
- XSS prevention
- HTML sanitization
- Rate limiting

#### ✅ **Error Handling** (~20 tests)
- Custom error classes
- Validation errors
- Cast errors
- Duplicate key errors
- JWT errors
- Async error wrapper

#### ✅ **HTTP Helpers** (~20 tests)
- Success responses (200, 201)
- Client errors (400, 401, 404)
- Server errors (500)
- Response formatting

#### ✅ **Data Utilities** (~30 tests)
- Data sanitization
- String utilities
- Object manipulation
- Field picking/omitting

### Coverage Metrics

After running `npm run test:coverage`:

```bash
# Windows
start coverage/lcov-report/index.html

# macOS/Linux
open coverage/lcov-report/index.html
```

**Expected coverage:**
- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >85%
- **Lines**: >80%

### Example Test Output

```bash
$ npm test

PASS  __tests__/example.test.js
PASS  __tests__/unit/controllers/post.controller.test.js
PASS  __tests__/unit/middleware/auth.middleware.test.js
PASS  __tests__/utils/jwt.utils.test.js
PASS  __tests__/utils/http.helpers.test.js
PASS  __tests__/utils/data.utils.test.js
PASS  __tests__/utils/error.handling.test.js
PASS  __tests__/validation/validation.test.js
PASS  __tests__/security/security.test.js

Test Suites: 9 passed, 9 total
Tests:       175 passed, 175 total
Snapshots:   0 total
Time:        8.532 s
```

### Testing Philosophy

- ✅ **Unit Tests**: Test individual functions in isolation
- ✅ **Mock-based**: Fast execution without database dependencies
- ✅ **Pure Functions**: Verify logic without side effects
- ✅ **Edge Cases**: Comprehensive boundary testing
- ✅ **Error Scenarios**: Validate error handling paths

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
3. **Write tests** for your new feature
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Ricardo Vega
- GitHub: [@rvega1204](https://github.com/rvega1204)

## 🙏 Acknowledgments

- Express.js documentation
- MongoDB documentation
- JWT.io for token information
- Jest documentation for testing best practices

---

**Note**: Make sure to never commit your `.env` file to version control. Keep your secrets safe!