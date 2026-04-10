# Cruzar Deportes - Project Context

## Brand
- Sports jerseys e-commerce from Corrientes, Argentina
- Products: football/soccer jerseys from leagues worldwide, accessories, mystery boxes
- Personality: deportiva, accesible, apasionada
- WhatsApp: +54 3794000783

## Architecture (Monorepo)
- apps/home/ → Customer storefront (Nuxt 4 + Tailwind + Pinia) → Firebase Hosting
- apps/back-office/ → Admin panel (Nuxt 4 + Tailwind + Pinia) → Firebase Hosting
- services/api/ → Express.js backend → Render (https://cruzar-api.onrender.com)
- Database: Firebase Firestore
- Images: Cloudinary (pre-generated variants: original, main w_800, thumbnail w_400)
- Domain: cruzardeportes.com

## Design System
- Colors: Primary blue scale (#1e3a8a primary-900 through #eff6ff primary-50)
- Font: Poppins (sans-serif)
- Style: Clean, modern, sports-oriented. Uses Tailwind utility classes.
- Mobile responsive throughout.

## Commerce Model
- Individual sales: Product → Cart → Checkout → WhatsApp message to admin
- Mystery Box: Tiered surprise selection (Basic/Premium/Deluxe)
- Team Orders: Bulk ordering for teams with customization
- No online payment processing — orders negotiated via WhatsApp
- WhatsApp: +54 3794000783

## Key Pages (Storefront)
- Home: hero, features, featured products, mystery box + team orders CTAs
- Products: full catalog with filters (category, type, league)
- Product detail: image gallery, sizes, add to cart, related products
- Categories / Types / Leagues: browsable taxonomy pages
- Ofertas: Mystery box config, team orders
- FAQ, Cuidado de Camisetas: informational pages
- Search: Levenshtein similarity-based product search

## Back-Office Features
- Product CRUD with Cloudinary image management
- Category, Product Type, League management
- Order tracking with status workflow
- Bulk operations (price, discount, featured, stock, category)
- Dashboard with order stats and product summary

## API (services/api/)
- Express.js with Helmet, CORS, Morgan
- Auth: x-api-key header middleware
- Endpoints: /api/products, /api/categories, /api/product-types, /api/leagues, /api/orders, /api/upload, /api/auth, /api/health
- Firestore as database, Cloudinary for image hosting

## Development
- `npm run dev` in apps/home (port 3000) or apps/back-office (port 3001)
- API: `cd services/api && npm run dev` (port 3002)
- Deploy: `npm run deploy:storefront` / `npm run deploy:admin` (Firebase)
- Static builds (SPA mode, ssr: false)

## Important Notes
- All content in Spanish (Argentine)
- No emojis in storefront UI — use icon libraries (mdi, heroicons)
- Images use pre-generated Cloudinary variants, not dynamic transforms
- Cart persisted in localStorage
- Back-office auth: username/password with 24-hour session TTL
