# Deployment Guide

This guide provides detailed instructions for deploying the Task Management Application to various platforms.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deploy to Vercel](#deploy-to-vercel)
3. [Deploy to Netlify](#deploy-to-netlify)
4. [Deploy with Docker](#deploy-with-docker)
5. [Deploy to GitHub Pages](#deploy-to-github-pages)
6. [Environment Configuration](#environment-configuration)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Git installed (for version control)
- Account on your chosen deployment platform

## Deploy to Vercel

### Method 1: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd task-management-app
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? Yes
   - Which scope? Select your account
   - Link to existing project? No
   - Project name? task-management-app
   - Directory? ./
   - Override settings? No

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard

1. **Push code to Git repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Configure build settings (auto-detected from vercel.json)
   - Click "Deploy"

### Vercel Configuration

The `vercel.json` file is already configured:
```json
{
  "buildCommand": "npm run build && npx msw init public/ --save",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Deploy to Netlify

### Method 1: Using Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Netlify**
   ```bash
   cd task-management-app
   netlify init
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Method 2: Using Netlify Dashboard

1. **Push code to Git repository** (same as Vercel)

2. **Deploy via Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to your Git provider
   - Select your repository
   - Build settings (auto-detected from netlify.toml):
     - Build command: `npm run build && npx msw init public/ --save`
     - Publish directory: `dist`
   - Click "Deploy site"

### Method 3: Drag and Drop

1. **Build locally**
   ```bash
   npm install
   npm run build
   npx msw init public/ --save
   ```

2. **Drag and drop**
   - Go to [netlify.com](https://netlify.com)
   - Drag the `dist` folder to the deployment zone

## Deploy with Docker

### Building and Running

1. **Build Docker image**
   ```bash
   docker build -t task-management-app .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:80 task-management-app
   ```

3. **Access application**
   - Open browser to `http://localhost:3000`

### Using Docker Compose

1. **Start services**
   ```bash
   docker-compose up -d
   ```

2. **Stop services**
   ```bash
   docker-compose down
   ```

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

### Push to Docker Hub

1. **Tag image**
   ```bash
   docker tag task-management-app yourusername/task-management-app:latest
   ```

2. **Login to Docker Hub**
   ```bash
   docker login
   ```

3. **Push image**
   ```bash
   docker push yourusername/task-management-app:latest
   ```

## Deploy to GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build && npx msw init public/ --save",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/task-management-app/', // Replace with your repo name
   });
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Select `gh-pages` branch as source
   - Save

## Environment Configuration

### Development
```bash
# .env.development
VITE_API_URL=http://localhost:3000
```

### Production
No environment variables needed since API is mocked with MSW.

### Custom Environment Variables

If you need custom variables:

1. **Create .env file**
   ```bash
   VITE_APP_NAME=Task Manager
   VITE_APP_VERSION=1.0.0
   ```

2. **Access in code**
   ```typescript
   const appName = import.meta.env.VITE_APP_NAME;
   ```

3. **Add to Vercel/Netlify**
   - Vercel: Settings → Environment Variables
   - Netlify: Site settings → Environment variables

## Troubleshooting

### MSW Service Worker Issues

**Problem**: Service worker not loading

**Solution**:
```bash
# Regenerate service worker
npx msw init public/ --save

# Clear browser cache
# Open DevTools → Application → Clear storage
```

### Build Failures

**Problem**: Build fails with TypeScript errors

**Solution**:
```bash
# Check for type errors
npm run type-check

# Fix errors and rebuild
npm run build
```

### Routing Issues (404 on refresh)

**Problem**: 404 error when refreshing pages

**Solution**: 
- Vercel: Ensure `vercel.json` has rewrites configured
- Netlify: Ensure `netlify.toml` has redirects configured
- Docker: Ensure `nginx.conf` has `try_files` configured

### Docker Build Issues

**Problem**: Docker build fails

**Solution**:
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t task-management-app .
```

### Performance Issues

**Problem**: Slow loading times

**Solutions**:
1. Enable gzip compression (already configured in nginx.conf)
2. Add CDN (automatic with Vercel/Netlify)
3. Optimize images and assets
4. Use lazy loading for routes

### HTTPS Issues in Production

**Problem**: MSW not working in production

**Solution**:
- Vercel/Netlify automatically provide HTTPS
- For custom domains, ensure SSL certificate is configured
- MSW requires HTTPS or localhost to work

## Deployment Checklist

Before deploying, verify:

- [ ] All tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] MSW service worker is initialized (`npx msw init public/ --save`)
- [ ] Environment variables are configured (if any)
- [ ] Git repository is up to date
- [ ] README.md is updated
- [ ] Version number is updated in package.json

## Post-Deployment

After successful deployment:

1. **Test the application**
   - Login with demo credentials
   - Create, update, and delete tasks
   - Test dark mode toggle
   - Verify responsive design on mobile
   - Test browser refresh (routing)

2. **Monitor**
   - Check deployment logs
   - Monitor error tracking (if configured)
   - Review analytics (if configured)

3. **Share**
   - Share deployment URL
   - Update documentation with live URL
   - Add deployment badge to README

## Continuous Deployment

### Vercel/Netlify Auto-Deploy

Once connected to Git:
- Push to `main` branch → automatically deploys to production
- Push to other branches → creates preview deployments
- Pull requests → automatic preview URLs

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

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
      - run: npm test
      - run: npm run build
      - run: npx msw init public/ --save
      # Add deployment steps for your platform
```

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Docker: [docs.docker.com](https://docs.docker.com)

---

Happy Deploying! 🚀
