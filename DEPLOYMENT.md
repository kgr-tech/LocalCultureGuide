# Deployment Guide

Deploy your Local Culture Guide to production in minutes!

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

That's it! Vercel automatically detects Vite and configures everything.

### Option 2: Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages

1. Update `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Add this line
  publicDir: 'public',
});
```

2. Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Install and deploy:
```bash
npm install --save-dev gh-pages
npm run deploy
```

### Option 4: Static Hosting (Any Provider)

```bash
# Build for production
npm run build

# Upload the 'dist' folder to your hosting provider
# Examples: AWS S3, Google Cloud Storage, Azure Static Web Apps
```

## 📋 Pre-Deployment Checklist

- [ ] Test production build locally: `npm run build && npm run preview`
- [ ] Verify all modules work correctly
- [ ] Check responsive design on mobile
- [ ] Test dark mode
- [ ] Ensure `product.md` is in `public/` folder
- [ ] Update meta tags in `index.html`
- [ ] Add favicon
- [ ] Test error boundaries
- [ ] Check browser console for errors

## 🔧 Configuration

### Environment Variables

Create `.env.production`:

```env
# Optional: Analytics
VITE_ANALYTICS_ID=your-analytics-id

# Optional: API endpoint (if you add backend later)
VITE_API_URL=https://api.yoursite.com
```

### Custom Domain

#### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

#### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS

### SEO Optimization

Update `index.html`:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- SEO Meta Tags -->
  <title>Bangalore Local Culture Guide | Explore Bangalore</title>
  <meta name="description" content="Interactive guide to Bangalore's culture, slang, street food, traffic, and lifestyle. Discover authentic local experiences." />
  <meta name="keywords" content="bangalore, culture, guide, street food, traffic, slang, local" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Bangalore Local Culture Guide" />
  <meta property="og:description" content="Your interactive guide to Bangalore's culture and lifestyle" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://yoursite.com" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Bangalore Local Culture Guide" />
  <meta name="twitter:description" content="Explore Bangalore's culture, food, and lifestyle" />
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
```

## 📊 Analytics (Optional)

### Google Analytics

1. Add to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible Analytics (Privacy-friendly)

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🔒 Security Headers

Add to `public/_headers` (Netlify) or `vercel.json` (Vercel):

### Netlify (_headers)
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Vercel (vercel.json)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## ⚡ Performance Optimization

### 1. Enable Compression

Most hosting providers enable this by default. Verify with:
```bash
curl -H "Accept-Encoding: gzip" -I https://yoursite.com
```

### 2. CDN

Vercel and Netlify include global CDN automatically.

### 3. Caching

Add to `public/_headers` (Netlify):
```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable
```

## 🐛 Debugging Production Issues

### Check Build Logs
```bash
npm run build
# Look for warnings or errors
```

### Test Production Build Locally
```bash
npm run build
npm run preview
# Test at http://localhost:4173
```

### Common Issues

**404 on refresh:**
- Add redirect rules for SPA routing

Netlify (`public/_redirects`):
```
/*    /index.html   200
```

Vercel (`vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Assets not loading:**
- Check `base` path in `vite.config.ts`
- Verify `public/` folder is included in build

**Slow loading:**
- Enable compression
- Check bundle size: `npm run build -- --report`
- Consider code splitting

## 📱 Progressive Web App (Optional)

Add PWA support with Vite PWA plugin:

```bash
npm install -D vite-plugin-pwa
```

Update `vite.config.ts`:
```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Bangalore Culture Guide',
        short_name: 'BLR Guide',
        description: 'Interactive Bangalore culture guide',
        theme_color: '#6366f1',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

## 🎉 Post-Deployment

1. Test all features on production URL
2. Check mobile responsiveness
3. Test on different browsers
4. Share with users!
5. Monitor analytics
6. Gather feedback

## 🔄 Continuous Deployment

### GitHub Actions (Example)

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
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

---

Need help? Check the [README](README.md) or open an issue!
