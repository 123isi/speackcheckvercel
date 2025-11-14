# API Integration Guide

## Setup

Create `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=https://speakcheck-back.onrender.com
```

## Authentication APIs

### Sign Up
```typescript
import { signUp } from "@/lib/auth";

const response = await signUp({
  email: "user@example.com",
  password: "password123",
  age: 23,
  major: "Computer Science"
});
```

### Login
```typescript
import { login } from "@/lib/auth";
import { setTokens } from "@/lib/token";

const response = await login({
  email: "user@example.com",
  password: "password123"
});

// Tokens are stored automatically
setTokens(response.access_token, response.refresh_token);
```

### Logout
```typescript
import { logout } from "@/lib/auth";
import { clearTokens } from "@/lib/token";

await logout(); // Uses access_token header
clearTokens();
```

### Refresh Token
```typescript
import { refreshToken } from "@/lib/auth";
import { setTokens, getRefreshToken } from "@/lib/token";

const response = await refreshToken(); // Uses refresh_token header
setTokens(response.access_token, getRefreshToken()!);
```

## Stage APIs

All Stage APIs require `Authorization: Bearer <token>` header (automatically added).

### Create Stage
```typescript
import { createStage } from "@/lib/stage";

const stage = await createStage({
  stageName: "My Presentation",
  situation: "Conference talk",
  checkList: "https://s3.../checklist.pdf"
});
```

### Get Stage List
```typescript
import { getStageList } from "@/lib/stage";

// Sort by time (latest first)
const stages = await getStageList("time");

// Sort by name
const stages = await getStageList("word");
```

### Get Stage Detail
```typescript
import { getStageDetail } from "@/lib/stage";

const stage = await getStageDetail(stageId);
// Returns: { stageId, stageName, speeches: [...] }
```

### Update Stage
```typescript
import { updateStage } from "@/lib/stage";

await updateStage(stageId, {
  stageName: "Updated Name"
});
```

### Delete Stage
```typescript
import { deleteStage } from "@/lib/stage";

await deleteStage(stageId);
```

## Speech APIs

All Speech APIs require `Authorization: Bearer <token>` header.

### Create Speech
```typescript
import { createSpeech } from "@/lib/speech";

const speech = await createSpeech({
  stage_id: "uuid",
  title: "My Speech"
});
```

### Get/Delete Speech
```typescript
import { getSpeech, deleteSpeech } from "@/lib/speech";

const speech = await getSpeech(speechId);
await deleteSpeech(speechId);
```

### Update Speech Video
```typescript
import { updateSpeechVideo } from "@/lib/speech";

await updateSpeechVideo(speechId, {
  video_source: "https://s3.../video.mp4"
});
```

### Update Speech Document
```typescript
import { updateSpeechDocument } from "@/lib/speech";

await updateSpeechDocument(speechId, {
  document_url: "https://s3.../document.pdf"
});
```

### Questions & Answers
```typescript
import { getQuestions, answerQuestion } from "@/lib/speech";

// Get questions for a speech
const questions = await getQuestions(speechId);

// Answer a question
await answerQuestion(questionId, {
  answer: "My answer",
  request_feedback: true // Optional, defaults to true
});
```

### Create Feedback
```typescript
import { createFeedback } from "@/lib/speech";

await createFeedback(speechId);
```

### Get FastAPI Stage
```typescript
import { getFastApiStage } from "@/lib/speech";

const stage = await getFastApiStage(stageId);
```

## File Upload

File upload is a two-step process:

```typescript
import { getPresignedUrl, uploadFileToS3 } from "@/lib/file";

// 1. Get presigned URL (no auth required)
const presignedUrl = await getPresignedUrl("myfile.pdf");

// 2. Upload file to S3
await uploadFileToS3(presignedUrl, file);

// The file will be at: uploads/<userId>/myfile.pdf
```

## Error Handling

All APIs throw typed errors:

```typescript
import { AuthError } from "@/lib/auth";
import { ApiError } from "@/lib/api";

try {
  await login({ email, password });
} catch (err) {
  if (err instanceof AuthError) {
    console.error(err.status, err.code, err.message);
    // err.code: "AUTH-401-1", "AUTH-404-1", etc.
  }
}

try {
  await createStage(data);
} catch (err) {
  if (err instanceof ApiError) {
    console.error(err.status, err.code, err.message);
    // err.code: "STAGE-404-1", "STAGE-403-1", etc.
  }
}
```

## Common Error Codes

### Auth
- `AUTH-401-1`: Login failed (invalid credentials)
- `AUTH-401-2`: Token expired
- `AUTH-401-3`: Token parsing failed
- `AUTH-404-1`: Refresh token not found
- `USER-404-1`: User not found

### Stage
- `STAGE-404-1`: Stage not found
- `STAGE-403-1`: Not stage owner

### File
- `FILE-400-1`: Missing fileName parameter

### Common
- `SERVER-400-1`: Validation error
- `SERVER-500-1`: Internal server error
