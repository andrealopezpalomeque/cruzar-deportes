# Deployment Guide

The frontends (home + back-office) deploy to **Firebase Hosting**. The API runs on a **DigitalOcean droplet** behind nginx, managed by PM2.

---

## Frontends

### Prerequisites

Set the Firebase project (only needed once per terminal session):

```bash
firebase use deportes-cruzar
```

### Deploy Home (Storefront)

```bash
cd apps/home
npm run generate
cd ../..
firebase deploy --only hosting:storefront
```

### Deploy Back Office (Admin)

```bash
cd apps/back-office
npm run generate
cd ../..
firebase deploy --only hosting:admin
```

### Deploy Both

```bash
# Build both apps
cd apps/home && npm run generate && cd ../..
cd apps/back-office && npm run generate && cd ../..

# Deploy both hosting targets
firebase deploy --only hosting
```

---

## API (services/api/)

Hosted on a DigitalOcean droplet (Ubuntu 24.04). Runs as the PM2 process `cruzar-api`, fronted by nginx on `https://api.cruzardeportes.com`.

- Repo path on droplet: `/var/www/cruzar-deportes`
- API path: `/var/www/cruzar-deportes/services/api`
- Process manager: PM2 (`cruzar-api`)
- Env file: `services/api/.env` (on the droplet, not committed)

### Deploy a code change

After merging API changes to `main`:

```bash
ssh root@<DROPLET_IP> 'cd /var/www/cruzar-deportes && git pull origin main'
ssh root@<DROPLET_IP> 'cd /var/www/cruzar-deportes/services/api && npm install --omit=dev'
ssh root@<DROPLET_IP> 'pm2 restart cruzar-api && pm2 logs cruzar-api --lines 20 --nostream'
```

If you only changed source (no new deps), you can skip the `npm install` step.

### Update an environment variable

PM2 keeps an in-memory copy of env vars from when the process started. Always pass `--update-env` when restarting after editing `.env`, otherwise the change won't take effect.

```bash
ssh root@<DROPLET_IP>
cd /var/www/cruzar-deportes/services/api
cp .env .env.bak.$(date +%Y%m%d-%H%M%S)
# edit .env
pm2 restart cruzar-api --update-env
pm2 logs cruzar-api --lines 15 --nostream
```

### Health check

```bash
curl -s https://api.cruzardeportes.com/api/health
```

### CORS allowlist

`ALLOWED_ORIGINS` in `services/api/.env` controls which origins can call the API. Currently includes:

- `https://cruzardeportes.com`, `https://www.cruzardeportes.com`
- `https://deportes-cruzar.web.app`, `https://deportes-cruzar.firebaseapp.com`
- `https://deportes-cruzar-admin.web.app`, `https://deportes-cruzar-admin.firebaseapp.com`
- `https://admin.cruzardeportes.com`
- `http://localhost:3000`, `http://localhost:3001` (dev)

To add an origin: edit `.env` on the droplet, append to the comma-separated list, then restart with `--update-env`.
