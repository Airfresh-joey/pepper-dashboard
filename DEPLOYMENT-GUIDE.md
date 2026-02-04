# 🚀 Deployment Guide - Joey's Command Center

## Quick Deploy to Vercel

### Option 1: Using Vercel CLI (Recommended)

```bash
# Navigate to dashboard directory
cd ~/clawd/dashboard

# Install Vercel CLI if needed
npm install -g vercel

# Deploy to production
vercel --prod

# When prompted:
# - Set up and deploy? Yes
# - Which scope? Your Vercel account
# - Link to existing project? No
# - Project name? pepper-dashboard
# - Directory? ./
# - Override settings? No

# Copy the production URL
# Then go to vercel.com to set custom domain: pepper-dashboard.vercel.app
```

### Option 2: Using Vercel Web Interface

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import from Git or upload the ~/clawd/dashboard folder
4. Project settings:
   - Framework Preset: Other
   - Build Command: (leave empty - static site)
   - Output Directory: ./
5. Click "Deploy"
6. Once deployed, go to Project Settings → Domains
7. Add custom domain: `pepper-dashboard.vercel.app`

## Files Included

```
~/clawd/dashboard/
├── index.html          # Main dashboard
├── login.html          # Login page
├── vercel.json         # Vercel configuration
├── README.md           # Documentation
├── TEST-REPORT.md      # Test results
└── DEPLOYMENT-GUIDE.md # This file
```

## Environment Configuration

No environment variables needed! Everything works out of the box:
- Weather API: Open-Meteo (free, no key required)
- Ski data: Hardcoded with realistic sample data
- Storage: Browser localStorage (client-side)

## Post-Deployment Checklist

- [ ] Visit pepper-dashboard.vercel.app
- [ ] Test login with password "pepper"
- [ ] Verify weather loads for Denver
- [ ] Check all 7 kanban boards appear
- [ ] Test clicking tasks to change status
- [ ] Test adding new tasks
- [ ] Verify clock updates every second
- [ ] Click ski resorts to open OnTheSnow
- [ ] Test logout and re-login
- [ ] Check mobile responsiveness

## Updating the Dashboard

```bash
cd ~/clawd/dashboard

# Make your changes to index.html or login.html

# Redeploy
vercel --prod
```

Changes go live in seconds!

## Custom Domain Setup

If you want to use a completely custom domain (e.g., dashboard.joey.com):

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed by Vercel
5. SSL certificate auto-generated

## Monitoring

Vercel provides automatic monitoring:
- Analytics: https://vercel.com/[your-username]/pepper-dashboard/analytics
- Logs: https://vercel.com/[your-username]/pepper-dashboard/logs
- Performance: Built-in Lighthouse scores

## Security Notes

- Password authentication is client-side (sessionStorage)
- For production use, consider adding server-side auth
- Currently suitable for personal/internal use
- All data stays in user's browser (localStorage)

## Support

If deployment fails:
- Check vercel.json is in root directory
- Ensure all HTML files are present
- Verify no syntax errors in HTML
- Check Vercel build logs

## Success!

Once deployed, share this URL with anyone:
**pepper-dashboard.vercel.app**

Password: `pepper`

Enjoy your command center! 🎯
