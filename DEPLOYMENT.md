# Deployment Guide - CollegeFinder

This guide covers deploying the CollegeFinder application to production environments.

## Quick Deployment

### Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set up domain and environment if needed
# Follow the prompts in the CLI
```

**Benefits:**
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments
- ✅ Automatic builds on git push
- ✅ Environment variables management
- ✅ Analytics and monitoring

**Cost:** Free tier available (generous limits)

### Using GitHub + Vercel

1. **Push to GitHub:**
```bash
git remote add origin https://github.com/yourusername/college-discovery-platform.git
git branch -M main
git push -u origin main
```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repo
   - Click "Deploy"

3. **Automatic Updates:**
   - Every push to `main` triggers a deployment
   - Preview URLs for pull requests
   - Rollback to previous versions anytime

---

## Manual Deployment

### Build for Production

```bash
# Build the application
npm run build

# Test the production build locally
npm start

# Visit http://localhost:3000
```

### Deploy to Cloud Platforms

#### AWS (S3 + CloudFront)

```bash
# 1. Build
npm run build

# 2. Configure AWS credentials
aws configure

# 3. Create S3 bucket
aws s3 mb s3://my-college-finder

# 4. Deploy static files
aws s3 cp .next/static s3://my-college-finder --recursive

# 5. Set up CloudFront distribution
# (Use AWS Console for this)
```

#### Google Cloud Run

```bash
# 1. Build Docker image
docker build -t college-finder .

# 2. Tag for Google Cloud
docker tag college-finder gcr.io/PROJECT_ID/college-finder

# 3. Push to container registry
docker push gcr.io/PROJECT_ID/college-finder

# 4. Deploy to Cloud Run
gcloud run deploy college-finder \
  --image gcr.io/PROJECT_ID/college-finder \
  --platform managed \
  --region us-central1
```

#### Heroku

```bash
# 1. Install Heroku CLI
# (Download from heroku.com)

# 2. Login
heroku login

# 3. Create app
heroku create my-college-finder

# 4. Deploy
git push heroku main
```

#### DigitalOcean App Platform

```bash
# 1. Go to DigitalOcean Dashboard
# 2. Click "Apps"
# 3. Click "Create Apps"
# 4. Connect GitHub repository
# 5. Select repository and branch
# 6. Click "Deploy"
```

---

## Environment Configuration

### Environment Variables (None Required)

This project **requires no environment variables** as it's entirely frontend-based.

If you extend the project with a backend, you would add:
```bash
# .env.local (for development)
# .env.production (for production)

# Example (if adding backend):
NEXT_PUBLIC_API_URL=https://api.example.com
API_SECRET_KEY=your-secret-key
```

### Node Environment

The application uses the `NODE_ENV` variable:
- **Development:** `npm run dev` (NODE_ENV=development)
- **Production:** `npm run build && npm start` (NODE_ENV=production)

---

## Performance Optimization

### Build Output

```bash
npm run build
# Output:
# - .next/: Optimized build output
# - public/: Static assets
# - Total size: ~5MB uncompressed
```

### Size Optimization

Current sizes:
- **Bundle:** ~150KB gzipped
- **JavaScript:** ~120KB
- **CSS:** ~30KB
- **Images:** Optimized with Next.js Image

### Caching Strategy

- **Static assets:** Cache indefinitely (fingerprinting)
- **HTML:** Cache 0 (dynamic)
- **API routes:** Cache 60 seconds (if added)

---

## Monitoring & Logging

### Local Monitoring

```bash
# Check build time
npm run build
# Output includes build metrics

# Check performance
npm run dev
# Browser DevTools: Network, Performance tabs
```

### Production Monitoring

#### Vercel Analytics (Built-in)
- Visit your Vercel dashboard
- See Web Vitals, Performance, Usage

#### Sentry (Error Tracking)

```bash
npm install @sentry/react @sentry/tracing

# Configure in your app
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

#### Google Analytics

```bash
npm install gtag

# Add to your layout.tsx
<Script
  strategy="lazyOnload"
  src={`https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`}
/>
```

---

## Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error: "Next.js version mismatch"**
```bash
# Update Next.js
npm install next@latest
npm run build
```

### Deployment Fails

**Vercel Error: "Build timeout"**
- Increase build timeout in `vercel.json`
- Check for large dependencies

**GitHub Actions Error**
- Ensure Node.js version is 18+
- Check environment variables are set

### Runtime Issues

**Page not found (404)**
- Check routing in `app/` directory
- Verify dynamic routes: `app/college/[id]/`

**Styling broken**
- Ensure TailwindCSS build completed
- Check for CSS conflicts
- Clear `.next/` cache

---

## Production Checklist

Before deploying to production:

- [ ] **Code Quality**
  - [ ] No console.log statements (except errors)
  - [ ] TypeScript checks pass (`npm run build`)
  - [ ] Linting passes (`npm run lint`)
  - [ ] No hardcoded credentials

- [ ] **Performance**
  - [ ] Bundle size acceptable (~150KB)
  - [ ] Lighthouse score > 90
  - [ ] Images optimized
  - [ ] Code splitting working

- [ ] **Security**
  - [ ] No security vulnerabilities (`npm audit`)
  - [ ] HTTPS enabled
  - [ ] CORS configured (if needed)
  - [ ] No sensitive data exposed

- [ ] **Functionality**
  - [ ] All pages load correctly
  - [ ] Search and filters work
  - [ ] Comparisons function properly
  - [ ] Responsive design tested
  - [ ] Mobile tested

- [ ] **Monitoring**
  - [ ] Analytics configured
  - [ ] Error tracking enabled
  - [ ] Logging configured
  - [ ] Performance monitoring active

---

## Rollback Procedure

### Vercel

```bash
# View deployment history
vercel list

# Rollback to previous deployment
vercel rollback [URL]

# Or through dashboard: Settings > Deployments > Promote
```

### GitHub

```bash
# View commit history
git log --oneline

# Revert to previous commit
git revert [COMMIT_HASH]
git push

# Then redeploy from Vercel
```

### Manual Servers

```bash
# Keep previous builds
# production/v1/ (current)
# production/v0/ (backup)

# Symbolic link for easy switching
ln -s /var/www/production/v0 /var/www/current
ln -s /var/www/production/v1 /var/www/current  # To rollback
```

---

## Scaling Considerations

### Current Limits

- **Current size:** ~5MB
- **Build time:** ~6 seconds
- **Deployment time:** ~30 seconds
- **Suitable for:** Up to 10,000 daily users

### Future Scaling

If adding a backend:

1. **Database:** PostgreSQL (Neon, AWS RDS)
2. **API Server:** Node.js (Express, Hono)
3. **Cache:** Redis (Upstash)
4. **Storage:** S3 or similar

**Architecture:**
```
User → CDN (Vercel)
  ├── Static Assets
  └── Next.js Server
      └── API Routes
          └── Database
```

---

## Cost Breakdown

### Vercel (Free Tier)
- 100GB bandwidth/month
- 1GB Function execution
- 0 per deployment
- **Perfect for most users**

### Vercel (Pro - $20/month)
- 1TB bandwidth
- Unlimited Function execution
- **For production apps with traffic**

### Custom Hosting
- **DigitalOcean:** $5-20/month
- **Heroku:** Free-$50/month
- **AWS:** Pay-per-use (~$5-50/month)

---

## Support & Resources

### Official Documentation
- **Next.js:** https://nextjs.org/docs
- **Vercel:** https://vercel.com/docs
- **TailwindCSS:** https://tailwindcss.com/docs
- **Zustand:** https://github.com/pmndrs/zustand

### Community
- Next.js Discord: https://discord.gg/nextjs
- React Discord: https://discord.gg/react
- Stack Overflow: #nextjs #react

### Troubleshooting
- Check logs: `vercel logs`
- Debug locally: `npm run dev`
- Clear cache: `rm -rf .next`

---

## Summary

**Quick Start:**
1. Fork/clone repository
2. Run `npm install`
3. Run `npm run build` to verify
4. Deploy to Vercel with `vercel` command

**That's it!** The application is ready for production.

---

*Last updated: May 2026*
*Version: 1.0.0 (Production Ready)*
