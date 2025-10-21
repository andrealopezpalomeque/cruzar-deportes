# Cruzar Deportes

Sports jersey e-commerce platform specializing in authentic team apparel from major leagues worldwide.

## 🌐 Live Sites

- **Customer Storefront**: https://deportes-cruzar.web.app/
- **Admin Back-Office**: https://cruzar-back-office.web.app/

## Repository Structure

```
📁 cruzar-deportes/
├── 📁 home/              # Customer-facing e-commerce storefront (Nuxt 4)
├── 📁 back-office/       # Admin panel for product management (Nuxt 4)
├── 📁 scraper/           # Image collection tool (Node.js)
├── 📁 shared/            # Shared resources and deployment scripts
│   ├── products.json     # Central product database (237 products, 5,707 images)
│   ├── catalog.ts        # Team catalog definitions
│   ├── types.ts          # TypeScript interfaces
│   ├── utils/            # Product sync and migration utilities
│   └── scripts/          # Deployment automation scripts
├── .env.example          # Environment configuration template
├── DEPLOYMENT-GUIDE.md   # Detailed deployment documentation
└── FIX-SUMMARY.md        # Image loading fixes and troubleshooting
```

## 📱 Applications Overview

### 1. Home - E-commerce Storefront

**Purpose**: Customer-facing sports jersey e-commerce platform
**Tech Stack**: Nuxt 4, Vue 3, Tailwind CSS, Pinia, Firebase Hosting, Cloudinary
**Live Demo**: https://deportes-cruzar.web.app/

```bash
cd home/
npm install
npm run dev                     # Development server
npm run firebase:build-deploy   # Build and deploy to production
```

**Features**:
- Comprehensive product catalog (AFC, CAF, Serie A, Eredivisie, LPF AFA)
- Shopping cart with size/color selection
- Category-based navigation and search
- Jersey care guides and FAQ
- Responsive mobile-first design

📖 **[View detailed documentation](home/README.md)**

### 2. Back-Office - Admin Panel

**Purpose**: Administrative interface for product and image management
**Tech Stack**: Nuxt 4, Tailwind CSS, Pinia, Cloudinary API, Firebase
**Live Demo**: https://cruzar-back-office.web.app/

```bash
cd back-office/
npm install
npm run dev    # Development server (http://localhost:3001)
```

**Current Status**:
- ✅ **Phase 1 Complete**: Core structure, authentication, responsive design
- ✅ **Phase 2 Complete**: Cloudinary integration, image management, album splitting
- 🚧 **Phase 3 Pending**: Product pricing, bulk operations, full product CRUD
- 🚧 **Phase 4 Pending**: Complete deployment setup

**Features**:
- Cloudinary album browsing and image selection
- Product image management with real-time preview
- Session-based authentication (username/password)
- Optimized loading with client-side caching

📖 **[View detailed documentation](back-office/README.md)**

### 3. Scraper - Image Collection Tool

**Purpose**: Automated image scraping from sports merchandise sources
**Tech Stack**: Node.js, Axios, Cheerio, Sharp, Winston logging

```bash
cd scraper/
yarn install
node src/scraper.js --help    # Show all commands
node src/scraper.js --list    # List available categories
```

**Two-Step Workflow**:
1. **Discover Albums**: `node src/scraper.js [category] [category_url]`
2. **Scrape Album**: `node src/scraper.js [category] --album [album_url]`

**Features**:
- Smart album detection and organization
- Anti-detection with rotating User-Agents
- Resumable sessions with progress tracking
- Image validation and format conversion

📖 **[View detailed documentation](scraper/README.md)**

## 🔧 Environment Configuration

The project uses a shared `.env` file at the repository root for Firebase and Cloudinary credentials.

### Setup Steps:

1. **Copy the example configuration**:
   ```bash
   cp .env.example .env
   ```

2. **Fill in your credentials**:
   ```env
   # Firebase service account (absolute path)
   GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/cruzar-back-office-service-account.json

   # Firebase project details
   GCLOUD_PROJECT=cruzar-back-office
   FIREBASE_STORAGE_BUCKET=cruzar-back-office.appspot.com
   ```

3. **The `.env` file is used by**:
   - `shared/scripts/deploy-home.sh` - Deployment automation
   - `back-office/` server API routes - Firebase Storage access
   - `shared/utils/productSync.ts` - Product synchronization

### Application-Specific Configuration:

Each application has its own `.env` file for app-specific settings:

**Home** (`home/.env`):
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Back-Office** (`back-office/.env`):
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
BACKOFFICE_USERNAME=admin
BACKOFFICE_PASSWORD=your_secure_password
```

## 🚀 Deployment Workflow

### Standard Deployment Pipeline

When you make changes in the back-office (product updates, image selections, pricing):

```bash
# From project root
./shared/scripts/deploy-home.sh
```

**What happens**:
1. ✅ Downloads latest `products.json` from Firebase Storage
2. ✅ Rebuilds catalog with fresh Cloudinary URLs
3. ✅ Installs dependencies for home app
4. ✅ Builds storefront (`npm run firebase:build`)
5. ✅ Deploys to Firebase Hosting (`npm run firebase:deploy`)

### Manual Operations

**Rebuild product catalog**:
```bash
cd back-office/
node scripts/rebuild-catalog.ts
node scripts/upload-products.ts
```

**Deploy storefront only**:
```bash
cd home/
npm run firebase:build-deploy
```

**Deploy back-office**:
```bash
cd back-office/
npm run firebase:build-deploy
```

## 📊 Project Status

### System Health
- ✅ **Home Storefront**: Fully operational
- ✅ **Image System**: All 5,707 Cloudinary URLs working
- ✅ **Product Database**: 237 products across 6 categories
- ✅ **Scraper**: Operational with two-step workflow
- 🚧 **Back-Office**: Image management complete, product CRUD pending

### Recent Updates
- Fixed Cloudinary image URL generation (Sept 2025)
- Removed TypeScript from Vue files in back-office
- Refactored authentication flow and session handling
- Implemented deep object comparison for product sync
- Migrated to unplugin-icons from @iconify/vue

### Next Steps
- [ ] Complete back-office Phase 3: Product pricing and bulk operations
- [ ] Implement full product CRUD in back-office
- [ ] Add inventory management features
- [ ] Enhance search and filtering capabilities

## 🛠️ Technology Stack

| Component | Technologies |
|-----------|-------------|
| **Frontend Framework** | Nuxt 4, Vue 3, TypeScript |
| **Styling** | Tailwind CSS (utility-first) |
| **State Management** | Pinia |
| **Icons** | Iconify (via unplugin-icons) |
| **Image Management** | Cloudinary |
| **Hosting** | Firebase Hosting |
| **Storage** | Firebase Cloud Storage |
| **Package Managers** | npm (home, back-office), yarn (scraper) |
| **Utilities** | VueUse, dayjs, vue3-toastify |

## 📚 Additional Documentation

- **[DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)** - Detailed deployment instructions and troubleshooting
- **[FIX-SUMMARY.md](FIX-SUMMARY.md)** - Image loading fixes and technical details
- **[home/README.md](home/README.md)** - Storefront architecture and features
- **[back-office/README.md](back-office/README.md)** - Admin panel documentation
- **[scraper/README.md](scraper/README.md)** - Scraper usage and configuration

## 🏃 Quick Start Guide

### For Development:
```bash
# Start storefront locally
cd home && npm install && npm run dev

# Start back-office locally
cd back-office && npm install && npm run dev

# Run scraper
cd scraper && yarn install && node src/scraper.js --help
```

### For Deployment:
```bash
# Deploy storefront after back-office changes
./shared/scripts/deploy-home.sh

# Or deploy manually
cd home && npm run firebase:build-deploy
```

### For Image Collection:
```bash
# Discover albums
cd scraper
node src/scraper.js [category] [category_url]

# Scrape specific album
node src/scraper.js [category] --album [album_url]
```

---

**Cruzar Deportes** - Vestí tu Pasión por el Deporte 🏆
