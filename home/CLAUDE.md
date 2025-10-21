# Cruzar Deportes - Sports Jersey E-commerce Platform

## Overview
Cruzar Deportes is a specialized e-commerce platform for **sports jerseys and apparel** from teams worldwide. **Primary focus: comprehensive product catalog, seamless shopping experience, and sports fan engagement**. The system provides essential tools for browsing teams, purchasing authentic jerseys, and accessing sports-related content.

**Target Users**: Sports fans and enthusiasts looking to purchase authentic team jerseys and apparel from various leagues and competitions worldwide.

## Business Model
**Direct-to-Consumer Sports Apparel E-commerce**:
- Comprehensive catalog of sports jerseys from major leagues (AFC, CAF, Serie A, Eredivisie, LPF AFA)
- Authentic team apparel with multiple sizes, colors, and customization options
- Content-rich experience with jersey care guides and sport-related information
- Customer-centric shopping experience with cart functionality and product discovery

### Core Value Proposition
- **Authentic Merchandise**: Official and replica jerseys from teams worldwide
- **Comprehensive Selection**: Multiple leagues, teams, sizes, and colors
- **Expert Content**: Jersey care guides, sizing information, and sport insights
- **Seamless Shopping**: Intuitive product discovery and checkout experience

## Tech Stack
- **Frontend**: Nuxt 4 (Vue 3), Tailwind CSS, TypeScript
- **State Management**: Pinia for product catalog, cart, and user data
- **Package Manager**: npm (not yarn)
- **Styling**: Tailwind CSS exclusively - NO custom CSS
- **Icons**: Iconify with unplugin-icons (`~icons/pack-name/icon-name` syntax)
- **Notifications**: vue3-toastify for user feedback
- **Date Handling**: dayjs-nuxt for all date operations

## Code Architecture

### Package JSON Scripts and Dependencies

```json
{
  "name": "nuxt-app",
  "type": "module",
  "private": true,
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  },
  "dependencies": {
    "@iconify/vue": "^5.0.0",
    "@nuxtjs/tailwindcss": "^6.14.0",
    "@pinia/nuxt": "^0.11.2",
    "@tailwindcss/aspect-ratio": "^0.4.2",
    "@vueuse/nuxt": "^13.6.0",
    "dayjs-nuxt": "^2.1.11",
    "nuxt": "^4.0.3",
    "pinia": "^3.0.3",
    "unplugin-icons": "^22.2.0",
    "vue": "^3.5.18",
    "vue-router": "^4.5.1",
    "vue3-toastify": "^0.2.8"
  },
  "devDependencies": {
    "@iconify/json": "^2.2.371",
    "@iconify/utils": "^3.0.1",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.16"
  }
}
```

### Architecture Patterns
- **Stores**: Pinia handles all product data, cart operations, and user state management
- **Components**: Reusable UI components for product display, cart interaction, and content presentation
- **Pages**: File-based routing with dynamic category and product pages
- **Content**: Informational pages for jersey care, FAQ, and customer support
- **State Management**: Centralized product catalog with cart persistence
- **Design**: Tailwind CSS, Iconify icons, responsive mobile-first approach
- **Utils**: Common functions for product filtering, price formatting, and cart calculations
- **Language**: All code and comments in English, UI text in Spanish for target market

### Store Architecture & State Management

**Pinia Implementation**:
- Product store manages catalog data, categories, and filtering logic
- Cart store handles shopping cart operations and persistence
- Computed properties for dynamic product filtering and featured item selection
- Reactive state management for real-time UI updates

**Data Architecture**:
```typescript
// Core data structures for e-commerce functionality
/products -> { id, name, slug, price, category, images, sizes, colors, inStock, featured }
/categories -> { id, name, slug, description, image, subcategories }
/cart -> { productId, quantity, size, color }
/users -> { id, email, firstName, lastName, avatar }
```

**Store Method Pattern**:
```typescript
// Standard store methods for e-commerce operations
fetchProducts()         // Load product catalog
fetchCategories()       // Load category data
getProductsByCategory() // Filter products by category
getFeaturedProducts()   // Get prioritized featured products
addToCart(item)        // Add product to shopping cart
updateCartItem(item)   // Modify cart item quantity/options
removeFromCart(id)     // Remove item from cart
```

### Component Structure

**Current Component Architecture**:
```
/components/
├── AppHeader.vue           # Main navigation and branding
├── AppFooter.vue           # Footer with links and info
├── ProductCard.vue         # Individual product display
├── ProductInfo.vue         # Detailed product information
├── ImageGallery.vue        # Product image carousel
├── JerseyCareSection.vue   # Jersey care content
├── GeneralFAQSection.vue   # FAQ content section
└── ui/
    └── Card.vue            # Base card component
```

**Component Guidelines**:
- **Reusable First**: Create components that can be used across multiple pages
- **Single Responsibility**: Each component should have one clear purpose
- **Props Over State**: Use props for component data, store access for global state
- **Tailwind Only**: All styling through Tailwind utility classes
- **Iconify Icons**: Use direct imports via unplugin-icons: `import IconName from '~icons/mdi/icon-name'` then `<IconName />`

## Core System Features

### 1. Product Catalog Management
- **Purpose**: Comprehensive sports jersey and apparel catalog
- **Features**: Category-based browsing, product filtering, search functionality
- **Data**: Product information, pricing, availability, images, sizes, colors
- **Categories**: AFC, CAF, Serie A, Eredivisie, LPF AFA, and more
- **Store**: `products.ts` | **Data Structure**: Product, Category interfaces

### 2. Shopping Cart System
- **Purpose**: Seamless e-commerce cart functionality
- **Features**: Add to cart, quantity management, size/color selection, cart persistence
- **Data**: Cart items with product references, quantities, size/color selections
- **Integration**: Real-time cart updates, inventory checking
- **Store**: `cart.ts` | **Data Structure**: CartItem interface

### 3. Content & Customer Education
- **Purpose**: Jersey care guides and customer support content
- **Features**: Jersey care instructions, sizing guides, FAQ section
- **Pages**: `/cuidado-camisetas`, `/faq` with rich content sections
- **Components**: `JerseyCareSection.vue`, `GeneralFAQSection.vue`

### 4. Category & Team Management
- **Purpose**: Organized browsing by leagues, teams, and competition types
- **Features**: Dynamic category pages, team-specific collections, league organization
- **Navigation**: Category-based filtering, breadcrumb navigation
- **Pages**: `/categories/[slug]` for dynamic category browsing

### 5. Product Discovery System
- **Purpose**: Help customers find products through intelligent recommendations
- **Features**: Featured products, discounted items prioritization, in-stock filtering
- **Logic**: Smart sorting by discounts, featured status, and price
- **Implementation**: Computed properties with complex sorting algorithms

## Page Structure

E-commerce focused page architecture:

- **Homepage**: `/index.vue` - Hero section, featured products, category navigation
- **Product Catalog**: `/products/index.vue` - Full product listing with filters
- **Product Details**: `/products/[slug].vue` - Individual product pages with full details
- **Category Pages**: `/categories/[slug].vue` - Category-specific product listings
- **Category Index**: `/categories/index.vue` - All available categories
- **Jersey Care**: `/cuidado-camisetas.vue` - Educational content for jersey maintenance
- **FAQ**: `/faq.vue` - Frequently asked questions and customer support

## TypeScript Interfaces & Data Structures

**E-commerce Data Models**:
```typescript
export type CategoryType = 'afc' | 'caf' | 'eredivisie' | 'lpf_afa' | 'serie_a_enilive'

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  originalPrice?: number  // For discount display
  category: CategoryType
  subcategory?: string
  images: string[]
  sizes: string[]
  colors: string[]
  inStock: boolean
  featured?: boolean      // For homepage highlighting
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  subcategories?: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  categoryId: string
  description?: string
  image?: string
}

export interface CartItem {
  productId: string
  quantity: number
  size: string
  color: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
}
```

## Development Guidelines

### Language Rules
- **Code & Comments**: Always in English for developer clarity
- **UI Text**: Always in Spanish for target market (Argentina/LATAM)
- **Variable Names**: English, descriptive, camelCase
- **Function Names**: English, action-based, descriptive

### E-commerce Best Practices

**Product Data Management**:
- **Inventory Tracking**: Real-time stock status updates
- **Price Display**: Clear pricing with discount calculations
- **Image Management**: Multiple product images with optimization
- **Size/Color Options**: Comprehensive variant management

**Shopping Cart Implementation**:
- **Persistence**: Cart state maintained across sessions
- **Validation**: Size/color selection required before add-to-cart
- **Updates**: Real-time quantity and option modifications
- **Checkout Preparation**: Structured data for payment processing

### UI/UX Principles for Sports E-commerce

**TARGET USERS**: Sports fans passionate about their teams and seeking authentic merchandise
**PRIMARY USE**: Product discovery, comparison, and purchase decisions
**PRIORITY**: Visual appeal, product authenticity, and seamless shopping experience

#### Core UX Philosophy
- **VISUAL FIRST**: High-quality product images and team branding
- **AUTHENTICITY**: Clear indication of official vs. replica merchandise
- **TEAM PRIDE**: Emphasize emotional connection to teams and sports
- **EASY DISCOVERY**: Intuitive category navigation and search
- **MOBILE OPTIMIZED**: Thumb-friendly shopping on mobile devices

#### E-commerce Design Requirements
- **Product-focused layout** - Hero images and clear product presentation
- **Category navigation** - Easy browsing by league, team, or product type
- **Clear pricing** - Prominent price display with discount highlighting
- **Size/color selection** - Visual and intuitive option selection
- **Trust indicators** - Quality guarantees, shipping info, customer reviews
- **Responsive images** - High-quality product photos across all devices

### CSS & Styling Guidelines
- **MANDATORY**: Use Tailwind CSS classes exclusively for all styling
- **NO custom CSS**: Avoid inline styles, custom CSS files, or `<style>` blocks
- **Component Styling**: All styling through Tailwind utility classes
- **Responsive Design**: Use Tailwind's responsive prefixes for mobile-first approach
- **E-commerce Focus**: Product grid layouts, card components, and shopping interfaces
- **Color Palette**: Team colors and sports-appropriate color schemes
- **Typography**: Clear, readable fonts for product names and descriptions
- **Interactive States**: Hover effects for product cards and buttons

### Library & Dependencies Guidelines

**APPROVED LIBRARIES**:
- **unplugin-icons** - Icon management via direct imports (`import IconName from '~icons/pack/name'`)
- **Tailwind CSS** (`@nuxtjs/tailwindcss`) - All styling and responsive design
- **Pinia** (`pinia`, `@pinia/nuxt`) - State management for products and cart
- **VueUse** (`@vueuse/nuxt`) - Vue composition utilities and helpers
- **vue3-toastify** - User notifications and feedback
- **dayjs-nuxt** - Date formatting for orders and content

**E-COMMERCE SPECIFIC RESTRICTIONS**:
- **NO payment processors** without explicit approval (Stripe, PayPal, etc.)
- **NO analytics libraries** beyond what's specifically requested
- **NO third-party UI kits** - build with Tailwind components only
- **NO complex image libraries** - use native lazy loading and optimization

**Before Adding Any Library**:
1. Check if functionality exists in approved libraries
2. Evaluate impact on bundle size for e-commerce performance
3. Consider mobile performance implications
4. Request approval for any payment or analytics integrations

## E-commerce Specific Guidelines

### Product Display Standards
- **High-Quality Images**: Multiple angles, zoom functionality, consistent lighting
- **Detailed Information**: Sizes, materials, care instructions, authenticity indicators
- **Pricing Strategy**: Clear discount presentation, original price strikethrough
- **Stock Status**: Real-time availability with clear out-of-stock messaging
- **Category Organization**: Logical league and team-based categorization

### Shopping Cart Requirements
- **Persistent State**: Cart maintains items across browser sessions
- **Option Validation**: Prevent cart addition without size/color selection
- **Inventory Integration**: Real-time stock checking during cart operations
- **Clear Communication**: Success messages, error handling, and user feedback
- **Mobile Optimization**: Touch-friendly cart interactions and checkout flow

### Content Strategy
- **Educational Content**: Jersey care guides, sizing information, authenticity guides
- **SEO Optimization**: Team names, league keywords, and product descriptions
- **Customer Support**: FAQ section, size guides, and care instructions
- **Trust Building**: Quality guarantees, shipping policies, return information

---

This documentation serves as the foundation for developing Cruzar Deportes e-commerce platform, ensuring consistency with established patterns while meeting the specific needs of sports fans and jersey enthusiasts in the target market.