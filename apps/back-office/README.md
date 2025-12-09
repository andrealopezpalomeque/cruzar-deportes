# Cruzar Deportes - Back Office

🚀 **Live Demo**: [https://cruzar-back-office.web.app/](https://cruzar-back-office.web.app/)

## Overview

Administrative panel for managing the sports jersey e-commerce platform.

## Features

✅ **Phase 1: Core Structure (Complete)**

- [x] Project setup with Nuxt 4 and Tailwind CSS
- [x] Simple username/password authentication
- [x] Main dashboard layout with navigation
- [x] Responsive design following main site aesthetic

✅ **Phase 2: Image Management (Complete)**

- [x] Cloudinary integration for album browsing
- [x] Image selection interface
- [x] Album splitting functionality

📋 **Phase 3: Product Management (Pending)**

- [x] Product creation y onboarding completo con selección de carpeta en Cloudinary
- [ ] Product listing and editing interfaces
- [ ] Pricing management (individual & bulk)
- [ ] Status management (featured, stock)
- [ ] Expand contextual bulk actions within product management

🚀 **Phase 4: Deployment (Pending)**

- [ ] Firebase project setup and deployment

## Development Setup

1. Install dependencies:

```bash
cd back-office
npm install
```

2. Set up environment variables:

```bash
# Create .env file with:
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
BACKOFFICE_USERNAME=admin
BACKOFFICE_PASSWORD=your_secure_password
```

> **Firebase access:** Copy the repository level `.env.example` to `.env` (at the repo root) and fill in the Firebase service account credentials there. The back-office server and the shared deploy scripts read that file to connect to Cloud Storage and keep `shared/products.json` in sync.

3. Run development server:

```bash
npm run dev
```

4. Access the back-office at: http://localhost:3001

### Sync catalog to Firebase Storage

When `shared/products.json` changes locally (e.g., after running migrations or manual edits), push it to Cloud Storage so the deployed back-office reads the updated catalog:

```bash
# from back-office/
gcloud config set project cruzar-back-office
gcloud storage cp ../shared/products.json gs://cruzar-back-office.firebasestorage.app/shared/products.json
```

The back-office API reads this file as the single source of truth, so make sure the upload succeeds before checking the deployed app.

## Default Login

- **Username**: admin (or value from BACKOFFICE_USERNAME)
- **Password**: cruzar2024 (or value from BACKOFFICE_PASSWORD)

## Architecture

- **Framework**: Nuxt 4 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Authentication**: Simple session-based
- **Image Management**: Cloudinary API integration
- **Deployment**: Firebase Hosting (separate project)

## Key Features

### 🖼️ Image Management

- Browse all Cloudinary albums organized by category
- Visual thumbnail previews with processing status
- **Optimized loading** - Fast album overview (< 2 seconds vs 10-25 seconds)
- Image selection interface with checkboxes and bulk operations
- Album splitting for multiple product variants
- Automatic sync with shared products database
- Persistent image selections storage
- Client-side caching with 5-minute TTL
- Skeleton loaders for better UX

### 💰 Product Management

- Product creation wizard with automatic Cloudinary folder generation, direct uploads from local files and quick image selection
- Individual and bulk pricing updates
- Contextual bulk actions surfaced directly in the product view (multiple selection)
- Featured product management
- Stock status control
- Real-time preview of changes

### 🎨 Modern UX/UI

- Clean, intuitive interface inspired by Apple's design philosophy
- Responsive mobile-first design
- Smooth animations and transitions
- Keyboard shortcuts for power users

### 🔐 Security

- Session-based authentication
- Protected API routes
- Environment variable configuration
- No complex auth needed - simple username/password
