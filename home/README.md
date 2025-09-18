# Cruzar Deportes - Sports Jersey E-commerce Platform

🚀 **Live Demo**: [https://deportes-cruzar.web.app/](https://deportes-cruzar.web.app/)

## Overview

Cruzar Deportes is a specialized e-commerce platform for sports jerseys and apparel from teams worldwide. Built with modern web technologies, it provides a comprehensive shopping experience for sports fans looking for authentic team merchandise.

### Key Features

- **Comprehensive Product Catalog** - Sports jerseys from major leagues worldwide
- **Category Organization** - Browse by leagues: AFC, CAF, Serie A, Eredivisie, LPF AFA, National Retro
- **Advanced Search & Filtering** - Find products quickly with intelligent search suggestions
- **Shopping Cart System** - Complete cart functionality with size/color selection
- **Responsive Design** - Mobile-first approach with seamless cross-device experience
- **Image Management** - Cloudinary integration for optimized product images
- **Customer Education** - Jersey care guides and comprehensive FAQ section
- **Custom Requests** - WhatsApp integration for personalized jersey requests
- **Admin Features** - Image upload and product management capabilities

## Technology Stack

### Frontend
- **Nuxt 4** - Vue.js framework with SSR/SSG capabilities
- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Pinia** - State management for Vue applications

### Libraries & Tools
- **@iconify/vue** + **unplugin-icons** - Icon system with extensive icon sets
- **@vueuse/nuxt** - Collection of Vue composition utilities
- **vue3-toastify** - Toast notifications for user feedback
- **dayjs-nuxt** - Date manipulation and formatting
- **@nuxtjs/cloudinary** - Image optimization and management

### Infrastructure
- **Cloudinary** - Image hosting and optimization
- **Firebase Hosting** - Fast and secure web hosting
- **npm** - Package management

## Project Structure

```
├── components/
│   ├── ui/                    # Base UI components
│   │   ├── Accordion.vue
│   │   ├── AccordionItem.vue
│   │   ├── Button.vue
│   │   └── Card.vue
│   ├── admin/                 # Admin functionality
│   │   └── ImageUpload.vue
│   ├── AppHeader.vue          # Main navigation
│   ├── AppFooter.vue          # Footer with links
│   ├── ProductCard.vue        # Product display component
│   ├── ProductInfo.vue        # Detailed product information
│   ├── ImageGallery.vue       # Product image carousel
│   ├── CartModal.vue          # Shopping cart interface
│   ├── SearchModal.vue        # Search functionality
│   └── *Skeleton.vue          # Loading state components
├── pages/
│   ├── index.vue              # Homepage
│   ├── products/
│   │   ├── index.vue          # Product catalog
│   │   └── [slug].vue         # Individual product pages
│   ├── categories/
│   │   ├── index.vue          # Category overview
│   │   └── [slug].vue         # Category-specific listings
│   ├── search.vue             # Search results page
│   ├── cuidado-camisetas.vue  # Jersey care guide
│   └── faq.vue                # Frequently asked questions
├── stores/
│   ├── products.ts            # Product catalog management
│   ├── cart.ts                # Shopping cart state
│   └── search.ts              # Search functionality
├── types/
│   └── index.ts               # TypeScript interfaces
├── utils/                     # Utility functions
├── assets/                    # Static assets
└── layouts/                   # Page layouts
```

## Data Models

### Core Interfaces

```typescript
export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  originalPrice?: number  // For discounted items
  category: CategoryType
  subcategory?: string
  images: string[]
  sizes: string[]
  colors: string[]
  inStock: boolean
  featured?: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  subcategories?: Subcategory[]
}

export interface CartItem {
  productId: string
  quantity: number
  size: string
  color: string
}
```

### Supported Categories
- **AFC** - Asian Football Confederation teams
- **CAF** - Confederation of African Football teams
- **Serie A** - Italian Serie A teams
- **Eredivisie** - Dutch Eredivisie teams
- **LPF AFA** - Argentine football teams
- **National Retro** - Historical national team jerseys

## Development

### Prerequisites
- Node.js (18+ recommended)
- npm package manager

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd cruzar-deportes/home

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Configure Cloudinary and Firebase credentials
```

### Environment Variables

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FIREBASE_PROJECT_ID=your_project_id
```

### Development Server

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run generate         # Generate static site
npm run preview          # Preview production build locally

# Firebase deployment
npm run firebase:build   # Build for Firebase hosting
npm run firebase:deploy  # Deploy to Firebase
npm run firebase:build-deploy  # Build and deploy in one command

# Cloudinary utilities
npm run migrate:cloudinary      # Migrate images to Cloudinary
npm run retry:failed-uploads    # Retry failed image uploads
```

## Features Implementation

### E-commerce Functionality
- **Product Catalog** - Dynamic product loading with categories
- **Shopping Cart** - Persistent cart with size/color variants
- **Search System** - Real-time search with suggestions
- **Product Filtering** - Filter by category, price, availability
- **Featured Products** - Smart prioritization of discounted and featured items

### UI/UX Features
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Loading States** - Skeleton components for better perceived performance
- **Image Optimization** - Cloudinary integration for fast image loading
- **Toast Notifications** - User feedback for actions
- **WhatsApp Integration** - Direct customer service connection

### Content Management
- **Jersey Care Guides** - Educational content for product maintenance
- **FAQ System** - Comprehensive customer support
- **Admin Tools** - Image upload and product management

## Deployment

### Firebase Hosting

The application is deployed on Firebase Hosting at [https://deportes-cruzar.web.app/](https://deportes-cruzar.web.app/)

#### Deployment Configuration

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### Deploy to Firebase

```bash
# Build and deploy
npm run firebase:build-deploy

# Or step by step
npm run firebase:build
npm run firebase:deploy
```

## State Management

### Pinia Stores

- **Products Store** (`stores/products.ts`)
  - Product catalog management
  - Category organization
  - Search functionality
  - Featured product logic

- **Cart Store** (`stores/cart.ts`)
  - Shopping cart state
  - Item management (add, update, remove)
  - Cart persistence

- **Search Store** (`stores/search.ts`)
  - Search query management
  - Search suggestions
  - Search history

## Performance Optimizations

- **Image Optimization** - Cloudinary automatic optimization
- **Code Splitting** - Nuxt automatic route-based splitting
- **Lazy Loading** - Components and images loaded on demand
- **Caching** - Browser caching for static assets
- **Minification** - Production build optimization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is private and proprietary.

---

**Cruzar Deportes** - Vestí tu Pasión por el Deporte 🏆