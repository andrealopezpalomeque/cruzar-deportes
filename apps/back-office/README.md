# Back-Office Admin Panel

Administrative interface for managing Cruzar Deportes products and images.

## 🚀 Live Site
https://cruzar-back-office.web.app/

## 🛠 Tech Stack
- **Framework**: Nuxt 4 (SSR on Firebase Functions)
- **Auth**: Simple Session-based
- **Styling**: Tailwind CSS
- **Storage**: Firebase Cloud Storage (Direct Read/Write)

## 📦 Data Lifecycle
The Back-Office acts as the **source of truth** editor.
1.  **Reads**: Fetches `products.json` directly from Firebase Cloud Storage.
2.  **Writes**: Saves changes immediately to Storage.

Changes made here are **live** in the database but require a **Storefront Rebuild** to appear on the public site.

## 💻 Development

```bash
# Install dependencies (root)
npm install

# Run development server
npm run dev -w apps/back-office
# OR
npm run dev --prefix apps/back-office
```

Access locally at: http://localhost:3001

## 🔑 Environment
Ensure you have the `.env` file at the **root** of the monorepo with:
- `GOOGLE_APPLICATION_CREDENTIALS` (Service Account Key path)
- `BACKOFFICE_USERNAME` / `PASSWORD`

## 📜 TypeScript Policy
**Rule:** No TypeScript in Vue components (`.vue` files). Use plain JavaScript (`<script setup>`).
**Allowed:** TypeScript IS allowed in `server/`, `utils/`, `stores/`, and `types/`.
**Enforcement:** `npm run check:no-ts` verifies this rule.

## 🚢 Deployment

This app uses Firebase Hosting + Cloud Functions (SSR).

```bash
# Deploy Admin + Functions
firebase deploy --only hosting:admin,functions
```
