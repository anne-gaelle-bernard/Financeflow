# FinanceFlow - Full Stack Setup Guide

## Status ✅

**Backend**: ✅ Working on http://localhost:3000
**Frontend**: ✅ Working on http://localhost:5173  
**Database**: ✅ MongoDB Connected (localhost:27017)

---

## Architecture

```
Frontend (React 18 + Vite)
    ↓
    Axios API Client
    ↓
Backend (Express)
    ↓
MongoDB (Mongoose)
```

---

## Key Endpoints

### Users
- `POST /api/users/register` - Register new user (creates 8 default categories)
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user (protected)

### Categories (Auto-created on signup)
1. 🔴 Alimentation - Courses, restaurants (#ef4444)
2. 🔵 Transport - Essence, transport en commun (#3b82f6)
3. 🟣 Loisirs - Divertissements, hobbies (#8b5cf6)
4. 🔷 Santé - Médical, pharmacie (#06b6d4)
5. 🟠 Logement - Loyer, électricité, eau (#f59e0b)
6. 🟢 Travail - Revenus, salaire (#10b981)
7. 💜 Investissement - Épargne, placements (#6366f1)
8. ⚫ Autre - Autres dépenses (#6b7280)

- `GET /api/categories/user/:userId` - Get user categories (protected)
- `POST /api/categories` - Create category (protected)

### Transactions
- `GET /api/transactions/user/:userId` - Get user transactions (protected)
- `POST /api/transactions` - Create transaction (protected)
- `PUT /api/transactions/:id` - Update transaction (protected)
- `DELETE /api/transactions/:id` - Delete transaction (protected)

### Budgets
- `GET /api/budgets/user/:userId` - Get user budgets (protected)
- `POST /api/budgets` - Create budget (protected)

### Reports
- `GET /api/reports/user/:userId` - Get user reports (protected)
- `POST /api/reports` - Create report (protected)

---

## Authentication Flow

1. **Register**
   ```json
   POST /api/users/register
   {
     "firstName": "Anne",
     "lastName": "Bernard",
     "email": "anne@example.com",
     "password": "Password123"
   }
   ```
   Response includes JWT token + 8 default categories

2. **Login**
   ```json
   POST /api/users/login
   {
     "email": "anne@example.com",
     "password": "Password123"
   }
   ```
   Response includes JWT token

3. **Protected Requests**
   ```
   Header: Authorization: Bearer {token}
   ```

---

## Database Schema

### User
```javascript
{
  username: String,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed with bcryptjs),
  createdAt: Date,
  updatedAt: Date
}
```

### Category
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  description: String,
  color: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction
```javascript
{
  userId: ObjectId (ref: User),
  categoryId: ObjectId (ref: Category),
  amount: Number,
  type: String (income/expense),
  description: String,
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing with cURL/PowerShell

### Register
```powershell
$body = @{
  firstName="Test"
  lastName="User"
  email="test@example.com"
  password="Test123456"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/users/register" `
  -Method POST -ContentType "application/json" -Body $body
```

### Login
```powershell
$body = @{
  email="test@example.com"
  password="Test123456"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/users/login" `
  -Method POST -ContentType "application/json" -Body $body
```

### Get Categories
```powershell
$token = "your_jwt_token_here"
Invoke-WebRequest -Uri "http://localhost:3000/api/categories/user/user_id" `
  -Method GET -Headers @{Authorization="Bearer $token"}
```

---

## Frontend Integration

The frontend (`api.js`) is configured to:
- Base URL: `http://localhost:3000/api`
- Auto-manages JWT tokens in localStorage
- Sets `Authorization: Bearer {token}` headers automatically

### Example Frontend Usage
```javascript
import { registerUser, loginUser, getCategoriesByUser } from '../services/api'

// Register
const res = await registerUser({
  firstName: "Anne",
  lastName: "Bernard",
  email: "anne@example.com",
  password: "Password123"
})
// Token auto-stored in localStorage

// Login
const loginRes = await loginUser({
  email: "anne@example.com",
  password: "Password123"
})

// Fetch categories (token auto-included)
const categories = await getCategoriesByUser(userId)
```

---

## Starting the Application

### Terminal 1: Backend
```bash
cd Backend
node server.js
# Server running on http://localhost:3000
```

### Terminal 2: Frontend
```bash
cd Frontend
npm run dev
# Frontend running on http://localhost:5173
```

### Required
- MongoDB running on `mongodb://localhost:27017`
- Node.js and npm installed

---

## Key Features Implemented

✅ User Registration with bcryptjs password hashing
✅ User Login with JWT authentication (7-day expiry)
✅ Automatic creation of 8 default categories on signup
✅ Protected routes with JWT middleware
✅ Full CRUD for Transactions, Budgets, Categories, Reports
✅ MongoDB integration with Mongoose
✅ CORS enabled for cross-origin requests
✅ Error handling and validation
✅ Frontend API service layer with auto-token management

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string: `mongodb://localhost:27017/financeflow`

### Port Already in Use
```powershell
Get-Process node | Stop-Process -Force
```

### API 404 Errors
- Verify backend is running on port 3000
- Check that route paths are correct (e.g., `/api/users/register`)

### JWT Token Invalid
- Token expires after 7 days
- User needs to login again for new token

---

## Git Workflow

```bash
# Current branch
git branch  # feature/backend-auth

# Push changes
git push origin feature/backend-auth

# Merge to main when ready
git checkout main
git merge feature/backend-auth
```
