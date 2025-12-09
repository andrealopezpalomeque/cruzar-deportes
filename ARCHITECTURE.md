# System Architecture & Data Flow

This document outlines the architecture of the Cruzar Deportes monorepo and how data flows between the Back-Office, Firebase Storage, and the Storefront.

## 🏗️ High-Level Architecture

The system is organized as a **Monorepo** containing two main applications and shared packages:

```mermaid
graph TD
    Repo[Monorepo Root] --> Apps
    Repo --> Packages
    
    Apps --> Storefront[apps/home]
    Apps --> BackOffice[apps/back-office]
    
    Packages --> Shared[packages/shared]
    
    Storefront -.->|Imports Types & Utils| Shared
    BackOffice -.->|Imports Types & Utils| Shared
```

## 🔄 Data Lifecycle & Updates

The product data (`products.json`) is the central source of truth. It is managed by the Back-Office and stored in the cloud, then consumed by the Storefront.

### Current Flow (Static Generation)

1.  **Edit**: Admin updates a product in the Back-Office.
2.  **Save**: Back-Office writes the updated JSON to **Firebase Cloud Storage**.
3.  **Deploy**: Storefront must be **rebuilt** to include the new JSON.

```mermaid
sequenceDiagram
    participant Admin
    participant BO as Back-Office (App)
    participant Storage as Firebase Cloud Storage
    participant Dev as Developer / CI
    participant Store as Storefront (App)

    Note over Admin, Storage: Phase 1: Update
    Admin->>BO: Updates Product Price
    BO->>Storage: Writes products.json
    BO->>BO: UI Updates (Locally)
    
    Note over Storage, Store: Phase 2: Reflection
    Note right of Storage: *Storage has new data*<br/>*Storefront has OLD data*
    
    Dev->>Storage: 1. Downloads products.json
    Dev->>Store: 2. npm run generate (Build)
    Dev->>Store: 3. firebase deploy
    
    Store->>User: Now serves updated content
```

### Implications
*   **Back-Office**: Reflects changes immediately because it reads directly from Cloud Storage or Local cache.
*   **Storefront**: Reflects changes **only after a redeployment**. This ensures maximum performance (no API calls for data) but requires a build step for updates.

## 🚀 Deployment Strategy

### Firebase Project Structure
All applications now exist under a single Firebase project (`deportes-cruzar`).
*   **Hosting Target**: `storefront` -> `apps/home`
*   **Hosting Target**: `admin` -> `apps/back-office`

### Recommended Workflow
To publish changes made in the Back-Office to the public Storefront:

1.  **Verify Data**: Check the Back-Office to ensure all products look correct.
2.  **Trigger Deploy**:
    ```bash
    # From project root
    npm run deploy:storefront
    # (Assuming a script exists to download json + build + deploy)
    ```

    *If doing it manually:*
    ```bash
    # 1. Download latest data (if not using shared/scripts yet)
    # 2. Build and Deploy
    cd apps/home
    npm run firebase:build-deploy
    ```

## 🔌 Future Improvements: Runtime Fetching

To avoid rebuilding for every price change, we can switch the Storefront to **Runtime Fetching**:

```mermaid
sequenceDiagram
    participant User
    participant Store as Storefront
    participant Storage as Firebase Cloud Storage

    User->>Store: Visits Website
    Store->>Storage: Fetches https://.../products.json
    Storage-->>Store: Returns Data
    Store-->>User: Renders Page with Live Data
```

**Pros**: Instant updates.
**Cons**: Small network delay on initial load.
