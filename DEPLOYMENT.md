# Deployment Guide

## Prerequisites

Set the Firebase project (only needed once per terminal session):

```bash
firebase use deportes-cruzar
```

---

## Deploy Home (Storefront)

```bash
cd apps/home
npm run generate
cd ../..
firebase deploy --only hosting:storefront
```

---

## Deploy Back Office (Admin)

```bash
cd apps/back-office
npm run generate
cd ../..
firebase deploy --only hosting:admin
```

---

## Deploy Both

```bash
# Build both apps
cd apps/home && npm run generate && cd ../..
cd apps/back-office && npm run generate && cd ../..

# Deploy both hosting targets
firebase deploy --only hosting
```
