# Cruzar Deportes

Sports jersey e-commerce platform specializing in authentic team apparel from major leagues worldwide.

## Repository Structure

```
📁 home/        # Nuxt 4 e-commerce web application
📁 scraper/     # Image collection tool for product catalog
```

## Home Application

**Tech Stack:** Nuxt 4 + Vue 3 + Tailwind CSS + Pinia + Firebase Hosting

```bash
cd home/
npm install
npm run dev          # Development server
npm run build        # Production build
npm run firebase:deploy # Deploy to Firebase
```

**Live Site:** https://deportes-cruzar.web.app/

## Scraper Tool

Image collection tool for building product catalogs from sports merchandise sources.

```bash
cd scraper/
yarn install
node src/scraper.js --help    # Show commands
node src/scraper.js --list    # Available categories
```

## Quick Start

1. **Development:** `cd home && npm run dev`
2. **Image Collection:** `cd scraper && node src/scraper.js --help`
3. **Deploy:** `cd home && npm run firebase:build-deploy`

