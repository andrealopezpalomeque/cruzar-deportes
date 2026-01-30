# Storefront (Cruzar Deportes)

This is the customer-facing e-commerce application for Cruzar Deportes.

## 🚀 Live Site
https://deportes-cruzar.web.app/

## 🛠 Tech Stack
- **Framework**: Nuxt 4 (SSG/SPA)
- **State**: Pinia
- **Styling**: Tailwind CSS
- **Data**: External API
- **Images**: Cloudinary

## 📦 Data Source
This app fetches product data from the external API at runtime. Configure the API URL via the `NUXT_PUBLIC_API_URL` environment variable.

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
- `utils/catalogLoader.ts` - Fetches and transforms data from the external API