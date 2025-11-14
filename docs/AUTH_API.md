# Authentication API Integration

## Setup

1. Create a `.env.local` file in the project root:
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-host.com
```

2. The auth endpoints will be available at `{BASE_URL}/auth`

## Features Implemented

### Sign Up (`/signup`)
- Form validation for all required fields
- Age validation (must be positive integer)
- Loading states and error handling
- Success redirect to `/stage`

### Login (`/login`)
- Email/password authentication
- JWT token storage (localStorage)
- Error handling for invalid credentials
- Enter key support
- Link to signup page

## API Client (`src/lib/auth.ts`)

Handles all auth API calls with proper error handling:

```typescript
import { signUp, login, AuthError } from "@/lib/auth";

// Sign up
try {
  const response = await signUp({
    email: "user@example.com",
    password: "password123",
    age: 23,
    major: "Computer Science"
  });
} catch (err) {
  if (err instanceof AuthError) {
    console.error(err.message);
  }
}

// Login
try {
  const response = await login({
    email: "user@example.com",
    password: "password123"
  });
  // Tokens are automatically stored
} catch (err) {
  if (err instanceof AuthError) {
    console.error(err.message);
  }
}
```

## Token Management (`src/lib/token.ts`)

```typescript
import { setTokens, getAccessToken, clearTokens, isAuthenticated } from "@/lib/token";

// Store tokens (done automatically after login)
setTokens(accessToken, refreshToken);

// Get access token for API calls
const token = getAccessToken();

// Check if user is logged in
if (isAuthenticated()) {
  // User has valid token
}

// Logout
clearTokens();
```

## Error Handling

The API client handles three types of errors:

1. **Global errors** (validation/type mismatch):
```json
{ "status": 400, "code": "SERVER-400-1", "message": "유효성 검사 오류" }
```

2. **Service errors** (sign-up failures):
```json
{ "code": 400, "message": "회원가입 실패: Duplicate entry ..." }
```

3. **Auth errors** (login failures):
```json
{ "status": 401, "code": "AUTH-401-1", "message": "이메일 또는 비밀번호가 올바르지 않습니다." }
```

All errors are converted to `AuthError` instances with status, code, and message.

## Next Steps

To add protected routes, create an API client that includes the access token:

```typescript
import axios from "axios";
import { getAccessToken } from "@/lib/token";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.access_token = token;
  }
  return config;
});
```
