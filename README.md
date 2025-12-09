# Cruzar Deportes

Sports jersey e-commerce platform specializing in authentic team apparel from major leagues worldwide.

## 🌐 Live Sites

- **Customer Storefront**: https://deportes-cruzar.web.app/
- **Admin Back-Office**: https://deportes-cruzar-admin.web.app/

## 📂 Repository Structure (Monorepo)

The project is organized as a Monorepo using NPM Workspaces:

```
📁 cruzar-deportes/
├── 📁 apps/
│   ├── 📁 home/              # Customer-facing e-commerce storefront (Nuxt 4)
│   └── 📁 back-office/       # Admin panel for product management (Nuxt 4, SSR)
├── 📁 services/
│   └── 📁 scraper/           # Image collection tool (Node.js)
├── 📁 packages/
│   └── 📁 shared/            # Shared types, data, and utilities
│       ├── products.json     # Central product database
│       ├── types.ts          # TypeScript interfaces
│       └── utils/            # Shared logic
├── package.json              # Root workspace configuration
└── firebase.json             # Unified deployment configuration
```

## 🚀 Quick Start

### 1. Install Dependencies
Run this at the root to install dependencies for all applications:
```bash
npm install
```

### 2. Run Locally
You can start any application from the root using workspace commands:

**Storefront:**
```bash
npm run dev --prefix apps/home
# OR
npm run dev -w apps/home
```
*Access at: http://localhost:3000*

**Admin Panel:**
```bash
npm run dev --prefix apps/back-office
# OR
npm run dev -w apps/back-office
```
*Access at: http://localhost:3001*

**Scraper:**
```bash
cd services/scraper
yarn install # Scraper still uses yarn locally if preferred, or npm
node src/scraper.js --help
```

## 🔧 Environment Configuration

Shared keys (Firebase) are managed at the root or per-application `.env` files.

**Essential Variables:**
- `GOOGLE_APPLICATION_CREDENTIALS` (for server-side functions)
- `CLOUDINARY_*` (for image management)

## 🚢 Deployment

The project uses a unified `firebase.json` at the root.

```bash
# Deploy everything (Storefront + Admin)
firebase deploy

# Deploy Storefront only
firebase deploy --only hosting:storefront

# Deploy Admin Panel (Hosting + Functions)
firebase deploy --only hosting:admin,functions
```

## 📚 Additional Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture, data flow diagrams, and lifecycle explanation.

## 📱 Applications Details

### Home (Storefront)
- **Tech**: Nuxt 4 (SSG/SPA), Tailwind CSS, Pinia.
- **Data**: Reads product data at build time. Requires rebuild to update catalog.

### Back-Office (Admin)
- **Tech**: Nuxt 4 (SSR on Firebase Functions), Cloudinary Integration.
- **Auth**: Simple session-based login.
- **Features**: Product image management, album organization.

### Scraper
- **Tech**: Node.js, Cheerio, Sharp.
- **Usage**: Discovers and scrapes product images to build `products.json`.

---
**Cruzar Deportes** - Vestí tu Pasión por el Deporte 🏆
