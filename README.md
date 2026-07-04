# lens-backend

Backend service for Lens built with Bun, Hono, Drizzle ORM, and PostgreSQL.

## Requirements

- Bun
- PostgreSQL database
- A valid `DATABASE_URL`

## Setup

Install dependencies:

```sh
bun install
```

Create your environment variables before starting the server. The application reads the database connection from `DATABASE_URL` and uses `NODE_ENV` to decide which runtime environment to load.
- Create .env.development and .env.production and fill the env values as per `.env.example`

## Run

Development:

```sh
bun run dev
```

Production:

```sh
bun run prod
```

The server listens on `http://localhost:8000`.

## Database Migrations

Generate migrations from the Drizzle schema:

```sh
npx drizzle-kit generate
```

The Drizzle schema lives in `src/repository/schema.ts` and migration output is stored under `drizzle/`.

## API

### Health check

`GET /`

Returns a plain text response confirming the server is running and which environment is active.

### Versioned routes

All API routes for version 1 are mounted under `/v1`.

#### `POST /v1/user/login`

Logs a user in or creates the user flow used by the application.
- Clerk is used for user authentication in the client.
- Once user authenticates in the client, login api will called which passes email and userId as payload bofy.
- If user is present, user is returned along with organisation details from organisation_members table.
- If user is not present, new user is added to users table and an organisation is created for the user by default and will be added as a member in organisation_members table.

Request body:

```json
{
	"email": "user@example.com",
	"userId": "user-123"
}
```

Response body:
```json
{
    "success": true,
    "data": {
        "user": {
            "userId": "string",
            "name": "string" | null,
            "email": "string",
            "createdAt": "string"
        },
        "organisation": {
            "memberId": "string",
            "organisationId": "string",
            "userId": "string",
            "role": "string(admin | user)",
            "joinedAt": "string"
        }
    }
}
```

#### `POST /v1/user/llm-requests`

Returns LLM requests for the authenticated user.

Requires an `Authorization` header.

Flow:
- API used to fetch llm requests made by the user.
- This can be used for the user to verify LLM responses and adjust prompt as needed.
- Verifies if user is present in the organisation before fetching.

Request body:

```json
{
	"organisationId": "org-123"
}
```

#### `POST /v1/chat/completion`

Creates a chat completion request for the authenticated user.

Requires an `Authorization` header.

Flow:
- This a proxy API routed to LLM's.
- Users can directly call LLM services via this api and llm configuration and responses can be stored in the database for llm observability.

Request body:

```json
{
	"model": "gpt-4o-mini",
	"provider": "openai",
	"prompt": [
		{
			"role": "user",
			"content": "Hello"
		}
	],
	"apiKey": "your-openai-api-key",
	"temperature": 0.7,
	"top_p": 1,
	"organisationId": "org-123"
}
```

`provider` must be one of:

- `openai`
- `sarvamai`

#### `POST /v1/llm-request/fetch`

Fetches a single LLM request for the authenticated user.

Requires an `Authorization` header.

Request body:

```json
{
	"requestId": "req-123",
	"organisationId": "org-123"
}
```

## Authentication

Protected routes use the `Authorization` header. The middleware decodes the token and reads the user identifier from the token subject claim.

## Project Structure

- `src/index.ts` - application bootstrap
- `src/routes/v1/` - API routes
- `src/controller/` - request orchestration
- `src/service/` - external provider integrations
- `src/repository/` - database access
- `src/middleware/` - auth and request middleware
- `src/exceptions/` - typed error classes

## Notes

- The root route is a simple runtime check, not a full health endpoint.
- Both `dev` and `prod` scripts run Bun with hot reload; `prod` only changes `NODE_ENV`.