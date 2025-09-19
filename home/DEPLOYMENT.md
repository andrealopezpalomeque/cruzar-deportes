# Cruzar Deportes - Deployment Guide

## Overview
This document provides comprehensive deployment instructions for the Cruzar Deportes e-commerce platform, built with Nuxt 4 and deployed on Firebase Hosting.

**Live Site**: https://deportes-cruzar.web.app
**Firebase Project**: deportes-cruzar
**Console**: https://console.firebase.google.com/project/deportes-cruzar/overview

---

## Quick Deployment (Recommended)

### One-Command Deploy
```bash
npm run firebase:build-deploy
```
This command runs both build and deploy in sequence.

### Step-by-Step Quick Deploy
```bash
# 1. Build the application
npm run firebase:build

# 2. Deploy to Firebase
npm run firebase:deploy
```

---

## Deployment Options

### 1. Full Deployment (All Services)
Deploy everything configured in firebase.json:
```bash
firebase deploy
```

### 2. Hosting Only
Deploy only the static website:
```bash
firebase deploy --only hosting
```

### 3. Functions Only (if configured)
Deploy only cloud functions:
```bash
firebase deploy --only functions
```

### 4. Storage Rules Only (if configured)
Deploy only storage security rules:
```bash
firebase deploy --only storage
```

### 5. Firestore Rules Only (if configured)
Deploy only Firestore security rules:
```bash
firebase deploy --only firestore:rules
```

---

## Manual Deployment Steps

### Prerequisites
1. **Node.js**: Ensure you have Node.js 18+ installed
2. **Firebase CLI**: Install globally if not already installed
   ```bash
   npm install -g firebase-tools
   ```
3. **Authentication**: Login to Firebase
   ```bash
   firebase login
   ```

### Step-by-Step Manual Process

#### 1. Project Setup (One-time)
```bash
# Verify you're in the correct project
firebase use --list

# Switch to deportes-cruzar project if needed
firebase use deportes-cruzar
```

#### 2. Build Process
```bash
# Install dependencies
npm install

# Generate static files for hosting
npm run firebase:build
# This runs: nuxt generate
```

#### 3. Preview Build (Optional)
```bash
# Preview the generated files locally
npx serve .output/public
# or
firebase hosting:channel:deploy preview
```

#### 4. Deploy to Production
```bash
# Deploy to live site
firebase deploy --only hosting

# Or deploy all services
firebase deploy
```

#### 5. Verify Deployment
- Visit: https://deportes-cruzar.web.app
- Check console for any errors
- Test key functionality (navigation, product pages, cart)

---

## Build Process Details

### Build Command Breakdown
```bash
npm run firebase:build
```
This command runs `nuxt generate` which:
- Builds the client-side application
- Pre-renders all static routes
- Generates optimized static files in `.output/public`
- Creates a production-ready deployment

### Build Output
- **Location**: `.output/public/`
- **Content**: Static HTML, CSS, JS, and assets
- **Size**: Typically 4000+ files including images and assets

---

## Configuration Files

### package.json Scripts
```json
{
  "scripts": {
    "firebase:build": "nuxt generate",
    "firebase:deploy": "firebase deploy",
    "firebase:build-deploy": "npm run firebase:build && npm run firebase:deploy"
  }
}
```

### firebase.json Configuration
```json
{
  "hosting": {
    "public": ".output/public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|jsx|ts|tsx|css|html|json|ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(html)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=0, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

---

## Environment Variables

### Required Environment Variables
Check `.env` file for:
- Cloudinary configuration
- Any API keys
- Third-party service credentials

### Setting Environment Variables for Production
```bash
# For Firebase Functions (if using)
firebase functions:config:set service.key="value"

# For client-side (in .env)
NUXT_PUBLIC_API_URL=https://api.example.com
```

---

## Troubleshooting

### Common Issues

#### 1. Build Failures
**Error**: `ENOENT: no such file or directory, open '.output/server/package.json'`
- **Solution**: This is a warning for Firebase functions, ignore if only using hosting
- **Fix**: The build still completes successfully for static hosting

#### 2. Firebase Project Issues
**Error**: `Error: Failed to get Firebase project`
- **Solution**:
  ```bash
  firebase login
  firebase use deportes-cruzar
  ```

#### 3. Permission Errors
**Error**: `Permission denied`
- **Solution**:
  ```bash
  firebase login --reauth
  ```

#### 4. Large Bundle Warnings
**Warning**: `Some chunks are larger than 500 kB`
- **Impact**: Informational only, doesn't affect deployment
- **Optional Fix**: Implement code splitting if needed

#### 5. Deploy Failures
**Error**: `Upload failed`
- **Solution**:
  ```bash
  # Clear cache and retry
  rm -rf .output
  npm run firebase:build
  firebase deploy --only hosting
  ```

### Verification Steps
1. **Build Success**: Check that `.output/public` contains files
2. **Deploy Success**: Look for "Deploy complete!" message
3. **Site Accessibility**: Visit the hosting URL
4. **Functionality**: Test navigation, product pages, and cart

---

## Performance Optimization

### Pre-deployment Checklist
- [ ] Images optimized and compressed
- [ ] Unused dependencies removed
- [ ] Bundle size analyzed
- [ ] Cache headers configured (done in firebase.json)

### Monitoring
- **Firebase Console**: Monitor hosting metrics
- **Site Performance**: Use browser dev tools
- **Core Web Vitals**: Monitor with PageSpeed Insights

---

## Rollback Procedures

### Rolling Back a Deployment
```bash
# View deployment history
firebase hosting:releases:list

# Rollback to previous version
firebase hosting:releases:rollback

# Or deploy specific release
firebase hosting:releases:rollback --site deportes-cruzar --version VERSION_ID
```

---

## Automation Options

### GitHub Actions (Future Enhancement)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase Hosting
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run firebase:build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: deportes-cruzar
```

### Local Deployment Script
Create `scripts/deploy.sh`:
```bash
#!/bin/bash
set -e

echo "🏗️  Building application..."
npm run firebase:build

echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🌐 Live at: https://deportes-cruzar.web.app"
```

---

## Security Considerations

### Pre-deployment Security Checklist
- [ ] No API keys exposed in client code
- [ ] Environment variables properly configured
- [ ] Firebase security rules updated if needed
- [ ] HTTPS enforced (automatic with Firebase Hosting)

---

## Support and Maintenance

### Regular Maintenance Tasks
1. **Weekly**: Check deployment status and site functionality
2. **Monthly**: Review Firebase usage and costs
3. **Quarterly**: Update dependencies and rebuild

### Getting Help
- **Firebase Documentation**: https://firebase.google.com/docs/hosting
- **Nuxt Documentation**: https://nuxt.com/docs
- **Project Issues**: Check Firebase Console for errors

---

## Quick Reference

### Essential Commands
```bash
# Full deploy
npm run firebase:build-deploy

# Build only
npm run firebase:build

# Deploy only
firebase deploy --only hosting

# Check project
firebase use

# Login
firebase login

# Preview
firebase hosting:channel:deploy preview
```

### Important URLs
- **Live Site**: https://deportes-cruzar.web.app
- **Firebase Console**: https://console.firebase.google.com/project/deportes-cruzar
- **Project Settings**: https://console.firebase.google.com/project/deportes-cruzar/settings/general

---

*Last Updated: September 2024*
*Next Review: October 2024*