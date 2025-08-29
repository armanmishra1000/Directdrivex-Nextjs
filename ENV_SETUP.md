# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

## Required Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_WS_BASE_URL=ws://localhost:5000/ws_api

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=471697263631-k8un0og206itv9nrji334b7uk2hf8u37.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

## Production Configuration

For production deployment, update the values:

```bash
# Production API
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_BASE_URL=wss://api.yourdomain.com/ws_api

# Production Google OAuth
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
```

## Default Values

If environment variables are not set, the services will use these defaults:
- API Base URL: `http://localhost:5000`
- Google Client ID: `471697263631-k8un0og206itv9nrji334b7uk2hf8u37.apps.googleusercontent.com`
- Google Redirect URI: `http://localhost:3000/auth/google/callback`

## Usage in Services

The services now reference environment variables directly:
- `process.env.NEXT_PUBLIC_API_BASE_URL`
- `process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI`
