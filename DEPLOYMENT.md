# Deployment Guide

## Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

### Steps
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Link project
   vercel link
   ```

2. **Configure Environment Variables**
   ```bash
   # Set environment variables
   vercel env add NODE_ENV production
   vercel env add VITE_API_URL your_api_url
   ```

3. **Deploy**
   ```bash
   # Deploy to production
   vercel --prod
   
   # Deploy preview
   vercel
   ```

4. **Custom Domain**
   ```bash
   # Add custom domain
   vercel domains add yourdomain.com
   ```

### Vercel Features
- **Automatic deployments** from GitHub
- **Preview deployments** for PRs
- **Edge Functions** for serverless logic
- **Analytics** and speed insights
- **Web Vitals** monitoring

## Netlify Deployment

### Prerequisites
- Netlify account
- GitHub repository connected to Netlify

### Steps
1. **Connect Repository**
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Select GitHub repository
   - Configure build settings

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

3. **Environment Variables**
   ```bash
   # Set in Netlify dashboard or netlify.toml
   NODE_ENV=production
   VITE_API_URL=your_api_url
   ```

4. **Deploy**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login
   netlify login
   
   # Deploy
   netlify deploy --prod
   ```

### Netlify Features
- **Form handling** for contact forms
- **Identity** for authentication
- **Functions** for serverless logic
- **Split testing** for A/B testing
- **Lighthouse** integration

## Performance Optimization

### Build Optimization
```bash
# Analyze bundle
npm run build -- --mode analyze

# Check bundle size
npx vite-bundle-visualizer
```

### Image Optimization
- Use WebP format
- Implement lazy loading
- Use responsive images with srcset
- Compress images before upload

### Caching Strategy
```javascript
// Service worker for offline support
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW();
    }
  }
});
```

## Monitoring and Analytics

### Performance Monitoring
```javascript
// Track Core Web Vitals
import { onLCP, onFID, onCLS } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics endpoint
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric)
  });
}

onLCP(sendToAnalytics);
onFID(sendToAnalytics);
onCLS(sendToAnalytics);
```

### Error Tracking
```javascript
// Sentry integration
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your_dsn_here",
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
});
```

## Continuous Integration/Continuous Deployment (CI/CD)

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Clear cache
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

2. **Environment Variables Not Loading**
   - Check variable names (must start with `VITE_`)
   - Restart development server
   - Check `.env` file location

3. **Performance Issues**
   - Run Lighthouse audit
   - Check bundle size
   - Optimize images
   - Enable compression

4. **Deployment Issues**
   - Check build logs
   - Verify Node.js version
   - Check environment variables

### Support
- Vercel: https://vercel.com/support
- Netlify: https://community.netlify.com