# Cruzar Deportes

Sports jersey e-commerce platform specializing in authentic team apparel from major leagues worldwide.

## Live Sites

- **Customer Storefront**: https://deportes-cruzar.web.app/
- **Admin Back-Office**: https://deportes-cruzar-admin.web.app/

## Repository Structure (Monorepo)

The project is organized as a Monorepo using NPM Workspaces:

```
cruzar-deportes/
├── apps/
│   ├── home/              # Customer-facing e-commerce storefront (Nuxt 4)
│   └── back-office/       # Admin panel for product management (Nuxt 4, SSR)
├── package.json           # Root workspace configuration
└── firebase.json          # Unified deployment configuration
```

## Architecture

The system uses an **external API** for data management:

- **API Server**: Hosted on Render (`https://cruzar-api.onrender.com`)
- **Database**: Firebase Firestore (managed by the API)
- **Images**: Cloudinary CDN

### Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Back-Office │────▶│  External   │◀────│  Storefront │
│   (Admin)   │     │     API     │     │   (Home)    │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                          ▼
                    ┌───────────┐
                    │ Firestore │
                    │ Cloudinary│
                    └───────────┘
```

Both applications fetch product/category data from the external API at runtime. Changes made in the back-office are immediately visible on the storefront (no rebuild required).

## Quick Start

### 1. Install Dependencies
Run this at the root to install dependencies for all applications:
```bash
npm install
```

### 2. Environment Setup

**Storefront (`apps/home/.env`):**
```env
NUXT_PUBLIC_API_URL=https://cruzar-api.onrender.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
```

**Back-Office (`apps/back-office/.env`):**
```env
NUXT_PUBLIC_API_URL=https://cruzar-api.onrender.com
NUXT_PUBLIC_API_KEY=your_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run Locally

**Storefront:**
```bash
npm run dev -w apps/home
```
*Access at: http://localhost:3000*

**Admin Panel:**
```bash
npm run dev -w apps/back-office
```
*Access at: http://localhost:3001*

## Deployment

The project uses Firebase Hosting with a unified `firebase.json` at the root.

```bash
# Deploy everything (Storefront + Admin)
npm run deploy

# Deploy Storefront only
npm run deploy:storefront

# Deploy Admin Panel (Hosting + Functions)
npm run deploy:admin
```

## Applications Details

### Home (Storefront)
- **Tech**: Nuxt 4 (SPA), Tailwind CSS, Pinia
- **Data**: Fetches from external API at runtime
- **Features**: Product catalog, category browsing, WhatsApp integration

### Back-Office (Admin)
- **Tech**: Nuxt 4 (SSR on Firebase Functions), Cloudinary Integration
- **Auth**: Simple session-based login
- **Features**: Product CRUD, image management, category management

---
**Cruzar Deportes** - Vesti tu Pasion por el Deporte
