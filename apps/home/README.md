# Storefront (Cruzar Deportes)

This is the customer-facing e-commerce application for Cruzar Deportes.

## 🚀 Live Site
https://deportes-cruzar.web.app/

## 🛠 Tech Stack
- **Framework**: Nuxt 4 (SSG/SPA)
- **State**: Pinia
- **Styling**: Tailwind CSS
- **Data**: Static JSON (bundled at build time)
- **Images**: Cloudinary (via `@nuxtjs/cloudinary`)

## 📦 Data Source
This app imports product data from the shared package:
`import { ... } from '@cruzar/shared'`

The data is **static**. To update products on the live site, the application must be **rebuilt and redeployed**.

## 💻 Development

You can run this app from the monorepo root:

```bash
# Install dependencies (root)
npm install

# Run development server
npm run dev -w apps/home
# OR
npm run dev --prefix apps/home
```

Access locally at: http://localhost:3000

## 🚢 Deployment

Deployment is managed via the root `firebase.json`.

```bash
# Deploy only this app
firebase deploy --only hosting:storefront
```

## 📂 Structure
- `components/` - Vue components
- `pages/` - Nuxt pages
- `stores/` - Pinia stores
- `utils/catalogLoader.ts` - Loads and transforms data from `@cruzar/shared`