# Cruzar Deportes - Back Office

Administrative panel for managing the sports jersey e-commerce platform.

## Features

✅ **Phase 1: Core Structure (Complete)**
- [x] Project setup with Nuxt 4 and Tailwind CSS
- [x] Simple username/password authentication
- [x] Main dashboard layout with navigation
- [x] Responsive design following main site aesthetic

🚧 **Phase 2: Image Management (In Progress)**
- [x] Cloudinary integration for album browsing
- [ ] Image selection interface
- [ ] Album splitting functionality

📋 **Phase 3: Product Management (Pending)**
- [ ] Product listing and editing interfaces
- [ ] Pricing management (individual & bulk)
- [ ] Status management (featured, stock)
- [ ] Bulk operations system

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

3. Run development server:
```bash
npm run dev
```

4. Access the back-office at: http://localhost:3001

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
- Visual thumbnail previews
- Image selection and curation
- Album splitting for multiple product variants

### 💰 Product Management
- Individual and bulk pricing updates
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