# HFM Backend API

Backend REST API for the HFM project. Built with Node.js, Express, MongoDB, and JWT authentication.

## Features

- **Clean Architecture**: Modular structure with separation of concerns (models, controllers, routes, middleware)
- **Authentication & Authorization**: JWT-based authentication with secure password hashing (bcryptjs)
- **Member Management**: Complete CRUD operations for members with pagination and search
- **Excel Import/Export**: Import members from Excel files and export to Excel
- **Security**: Helmet, CORS, rate limiting, MongoDB injection prevention
- **Validation**: Input validation using Joi
- **Error Handling**: Centralized error handling middleware
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Secure file upload with Multer
- **Modern ES6+**: Uses ES Modules syntax

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Joi
- **Security**: Helmet, CORS, express-rate-limit, express-mongo-sanitize
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Excel Processing**: xlsx

## Project Structure

```
backend/
├── src/
│   ├── app.js                      # Express app configuration
│   ├── server.js                   # Server entry point
│   ├── config/
│   │   └── db.js                   # Database connection
│   ├── models/
│   │   ├── User.js                 # User model
│   │   └── Member.js               # Member model
│   ├── controllers/
│   │   ├── userController.js       # User controller
│   │   └── memberController.js     # Member controller
│   ├── routes/
│   │   ├── userRoutes.js           # User routes
│   │   └── memberRoutes.js         # Member routes
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT authentication
│   │   ├── errorMiddleware.js      # Error handling
│   │   ├── rateLimit.js            # Rate limiting
│   │   └── uploadMiddleware.js     # File upload handling
│   ├── utils/
│   │   └── generateToken.js        # JWT token generation
│   └── validations/
│       ├── userValidation.js       # User validation
│       └── memberValidation.js     # Member validation
├── uploads/                        # Temporary upload directory
├── .env                            # Environment variables (local)
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies and scripts
├── template-import-membres.csv     # Excel import template
└── README.md                       # This file
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mhm_db
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start MongoDB** (if using local MongoDB):
   ```bash
   mongod
   ```

4. **Run the application**:

   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm start
   ```

The server will start at `http://localhost:5000`

## API Endpoints

### Public Routes

#### Health Check
```http
GET /health
```

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Password Requirements**:
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

#### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Protected Routes (require authentication)

Add the JWT token to the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Get User Profile
```http
GET /api/users/me
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "NewPassword123"
}
```

### Member Management Routes (Protected)

All member routes require authentication.

#### Get All Members (with pagination)
```http
GET /api/members?page=1&limit=10&search=dupont&status=active
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in firstName, lastName, email
- `status` (optional): Filter by status (active, inactive, pending)

#### Get Single Member
```http
GET /api/members/:id
Authorization: Bearer <token>
```

#### Create New Member
```http
POST /api/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jean",
  "lastName": "Dupont",
  "dateOfBirth": "1985-03-15",
  "address": {
    "street": "12 Rue de la Paix",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France",
    "full": "12 Rue de la Paix, 75001 Paris, France"
  },
  "phone": "0601020304",
  "email": "jean.dupont@email.com",
  "status": "active",
  "notes": "Membre actif depuis 2020"
}
```

#### Update Member
```http
PUT /api/members/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jean",
  "phone": "0601020305",
  "status": "inactive"
}
```

#### Delete Member
```http
DELETE /api/members/:id
Authorization: Bearer <token>
```

#### Import Members from Excel
```http
POST /api/members/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [Excel file]
```

**Excel Format**:
Use the provided `template-import-membres.csv` as reference. Required columns:
- Prénom (or firstName)
- Nom (or lastName)
- Date de naissance (or dateOfBirth)

Optional columns:
- Adresse, Ville, Code postal, Pays
- Téléphone, Email, Notes

**Response**:
```json
{
  "success": true,
  "message": "Import terminé: 45 réussis, 2 erreurs",
  "data": {
    "success": [...],
    "errors": [...],
    "total": 47
  }
}
```

#### Export Members to Excel
```http
GET /api/members/export
Authorization: Bearer <token>
```

Returns an Excel file with all members.

#### Get Member Statistics
```http
GET /api/members/stats
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "total": 150,
    "active": 120,
    "inactive": 25,
    "pending": 5,
    "averageAge": 42
  }
}
```

### Membership Application Routes

Complete workflow for member applications without payment management.

#### Submit Membership Application (Public)
```http
POST /api/applications
Content-Type: application/json

{
  "firstName": "Jean",
  "lastName": "Dupont",
  "dateOfBirth": "1990-05-15",
  "address": {
    "street": "12 Rue de la Paix",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France"
  },
  "phone": "0601020304",
  "email": "jean.dupont@email.com",
  "memberType": "regular",
  "emergencyContact": {
    "name": "Marie Dupont",
    "phone": "0607080910",
    "relationship": "Épouse"
  },
  "occupation": "Ingénieur",
  "interests": "Sport, lecture"
}
```

**Member Types**: regular, student, honorary, family

**Required fields**: firstName, lastName, dateOfBirth, address (city, postalCode), phone, email, emergencyContact

#### Get Pending Applications (Protected)
```http
GET /api/applications/pending?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Application Details (Protected)
```http
GET /api/applications/:id
Authorization: Bearer <token>
```

#### Approve Application (Protected)
```http
PUT /api/applications/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Candidature validée"
}
```

#### Reject Application (Protected)
```http
PUT /api/applications/:id/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "rejectionReason": "Informations incomplètes"
}
```

#### Suspend Member (Protected)
```http
PUT /api/applications/:id/suspend
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Non-respect du règlement"
}
```

#### Reactivate Member (Protected)
```http
PUT /api/applications/:id/reactivate
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Réactivation suite à régularisation"
}
```

#### Get Application Statistics (Protected)
```http
GET /api/applications/stats
Authorization: Bearer <token>
```

**Member Status Workflow**:
- `pending` → Application submitted, awaiting review
- `active` → Application approved, member is active
- `rejected` → Application rejected with reason
- `suspended` → Active member temporarily suspended
- `inactive` → Former member

For detailed workflow documentation, see `PROCESSUS_ADHESION.md`.

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: bcryptjs with salt rounds
3. **Rate Limiting**:
   - General API: 100 requests per 15 minutes
   - Auth routes: 5 requests per 15 minutes
4. **Helmet**: Security headers
5. **CORS**: Configured for specific frontend origin
6. **MongoDB Injection Prevention**: Input sanitization
7. **Input Validation**: Joi schemas for all inputs

## Error Handling

The API uses a centralized error handling system that returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "stack": "Stack trace (development only)"
}
```

## Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Authentication routes**: 5 attempts per 15 minutes per IP
- **Password reset**: 3 attempts per hour per IP

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Adding New Routes

1. Create model in `src/models/`
2. Create controller in `src/controllers/`
3. Create routes in `src/routes/`
4. Create validation schema in `src/validations/`
5. Register routes in `src/app.js`

## Future Enhancements

- Email verification
- Password reset functionality
- Refresh tokens
- Social authentication (OAuth)
- Role-based access control
- File upload support
- Pagination for list endpoints
- API documentation with Swagger/OpenAPI
- Unit and integration tests
- Docker support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Author

HFM Team

## Support

For issues and questions, please open an issue in the repository.
