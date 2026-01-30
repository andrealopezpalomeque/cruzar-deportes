# System Architecture & Data Flow

This document outlines the architecture of the Cruzar Deportes monorepo and how data flows between the applications and the external API.

## High-Level Architecture

The system consists of two frontend applications that communicate with an external API:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Monorepo                                │
│  ┌─────────────────┐              ┌─────────────────┐          │
│  │   apps/home     │              │ apps/back-office│          │
│  │  (Storefront)   │              │    (Admin)      │          │
│  │   Nuxt 4 SPA    │              │  Nuxt 4 SSR     │          │
│  └────────┬────────┘              └────────┬────────┘          │
└───────────┼────────────────────────────────┼────────────────────┘
            │                                │
            │         HTTPS REST API         │
            └───────────────┬────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │     External API        │
              │  (cruzar-api.onrender)  │
              │                         │
              │  - Products CRUD        │
              │  - Categories CRUD      │
              │  - Image management     │
              └───────────┬─────────────┘
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
   ┌─────────────────┐       ┌─────────────────┐
   │    Firestore    │       │   Cloudinary    │
   │   (Database)    │       │    (Images)     │
   └─────────────────┘       └─────────────────┘
```

## Data Flow

### Runtime Data Fetching

Both applications fetch data from the external API at runtime:

```
┌──────────┐     GET /api/products      ┌──────────┐
│  User    │ ──────────────────────────▶│   API    │
│ Browser  │                            │  Server  │
│          │ ◀────────────────────────  │          │
└──────────┘     JSON Response          └──────────┘
```

**Benefits:**
- Changes in back-office are immediately visible on storefront
- No rebuild/redeploy required for content updates
- Single source of truth (API/Firestore)

### Admin Operations

When an admin updates a product:

```
┌─────────────┐    PUT /api/products/:id    ┌──────────┐
│ Back-Office │ ───────────────────────────▶│   API    │
│             │                             │          │
│             │ ◀─────────────────────────  │          │
└─────────────┘    Success Response         └──────────┘
                                                  │
                                                  ▼
                                           ┌──────────┐
                                           │Firestore │
                                           │ Updated  │
                                           └──────────┘
                                                  │
      ┌─────────────────────────────────────────────┘
      │ Next request from storefront
      ▼
┌──────────┐    GET /api/products    ┌──────────┐
│Storefront│ ──────────────────────▶ │   API    │
│          │ ◀────────────────────── │          │
└──────────┘    Updated Data         └──────────┘
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | List all active products |
| `/api/products/:id` | GET | Get single product |
| `/api/products` | POST | Create product |
| `/api/products/:id` | PUT | Update product |
| `/api/products/:id` | DELETE | Delete product |
| `/api/categories` | GET | List all categories |
| `/api/categories/:id` | GET | Get single category |

## Image Management

Images are stored in Cloudinary and managed through the back-office:

1. Admin uploads image via back-office
2. Image is uploaded to Cloudinary
3. Cloudinary URL is stored in Firestore via API
4. Storefront fetches product with Cloudinary URLs
5. Images are served via Cloudinary CDN with automatic optimization

## Deployment Strategy

### Firebase Project Structure

All applications exist under a single Firebase project (`deportes-cruzar`):

- **Hosting Target**: `storefront` -> `apps/home`
- **Hosting Target**: `admin` -> `apps/back-office`

### Deployment Commands

```bash
# Deploy everything
npm run deploy

# Deploy Storefront only
npm run deploy:storefront

# Deploy Admin Panel (Hosting + Functions)
npm run deploy:admin
```

## Environment Configuration

### Storefront (`apps/home`)
```env
NUXT_PUBLIC_API_URL=https://cruzar-api.onrender.com
CLOUDINARY_CLOUD_NAME=dmb1vyveg
```

### Back-Office (`apps/back-office`)
```env
NUXT_PUBLIC_API_URL=https://cruzar-api.onrender.com
NUXT_PUBLIC_API_KEY=<api-key>
CLOUDINARY_CLOUD_NAME=dmb1vyveg
CLOUDINARY_API_KEY=<cloudinary-key>
CLOUDINARY_API_SECRET=<cloudinary-secret>
```

## Caching Strategy

### Client-Side (Storefront)
- `catalogLoader.ts` caches API responses in memory
- Cache persists for the browser session
- Hard refresh clears the cache

### API-Side
- Consider implementing cache headers for GET requests
- CDN caching can be added at the API level if needed
