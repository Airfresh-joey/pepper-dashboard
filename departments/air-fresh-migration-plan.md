# AIR FRESH MARKETING - MIGRATION PLAN
**Created:** February 1, 2026 @ 10:05 AM MST
**From:** www.airfreshmarketing.com (old site)
**To:** dev2.airfreshmarketing.com → www.airfreshmarketing.com (new site)

---

## 🚨 CRITICAL: MUST NOT LOSE SEO VALUE

### Old Site Analysis
**Sitemap Pages:** 100+ URLs (truncated, likely 500-1000+ total)
**Structure:**
- Service pages: `/brand-ambassadors`, `/experiential-marketing`, etc.
- City pages: `/cities/{city}`
- City-service combos: `/city-services/{city}-{service}`
- Project/portfolio pages: `/projects/{client}`
- Legal pages: `/legal/terms-and-conditions`, `/legal/contractor-agreement`
- Special pages: `/joey-calendar`, `/discovery-call`, etc.

### New Site Analysis
**Sitemap Pages:** 1000+ URLs
**Structure:**
- Service pages: `/services/{service}`
- City pages: `/cities/{city}` (SAME as old - ✅)
- City-service combos: `/city-services/{city}-{service}` (SAME as old - ✅)
- Portfolio pages: `/portfolio/{case-study-id}`
- Event pages: `/events/{event}`
- Venue pages: `/venues/{venue}`

---

## 📊 URL MAPPING ANALYSIS

### ✅ URLs That Match (No Redirect Needed)
- `/cities/{city}` - Structure identical
- `/city-services/{city}-{service}` - Structure identical
- `/contact-us` → `/contact` (need redirect)
- `/blog` - Same

### ⚠️ URLs That Need Redirects
```
OLD → NEW

# Service Pages
/brand-ambassadors → /services/brand-ambassadors
/experiential-marketing → /services/experiential-marketing
/street-team-marketing → /services/street-teams
/convention-staffing → /services/convention-staffing
/promotional-models → /services/promotional-models
/guerilla-marketing → /services/guerrilla-marketing
/marketing-mascots → /services/marketing-mascots
/video-production → /services/event-production (or remove)

# Portfolio/Projects
/projects → /portfolio
/projects/{slug} → /portfolio (generic - no direct mapping)

# Special Pages
/about-us → /about
/contact-us → /contact
/joey-calendar → /contact (or keep as is)
/discovery-call → /contact
/brand-ambassador-order-form → /contact

# Legal
/legal/terms-and-conditions → /terms
/legal/contractor-agreement → /careers (or /talent)

# Other
/production-map → /locations (or /about)
/nationwide-brand-ambassadors → /services/brand-ambassadors
```

---

## 🔑 CREDENTIALS NEEDED (ASAP)

### 1. Google Analytics
- [ ] Access to existing Google Analytics account
- [ ] Get GA4 Measurement ID (format: G-XXXXXXXXX)
- **Action:** Joey, please share GA account email or add pepper@hummingagent.ai as user

### 2. Google Ads
- [ ] Access to Google Ads account
- [ ] Current campaign structure/keywords
- [ ] Monthly budget confirmation ($5k/month mentioned)
- **Action:** Joey, please share Google Ads login or add pepper@hummingagent.ai

### 3. Cloudflare
- [ ] Cloudflare account login
- [ ] DNS management access
- [ ] SSL/CDN configuration details
- **Action:** Joey, please share Cloudflare login

### 4. Google Search Console
- [ ] Set up new Search Console property for www.airfreshmarketing.com
- [ ] Verify domain ownership (via DNS or Cloudflare)
- [ ] Submit new sitemap.xml

---

## 🚀 RAPID LAUNCH PLAN (7-Day Timeline)

### **Day 1 (TODAY - Feb 1)**
- ✅ Site audit complete
- ✅ Migration plan created
- [ ] Get GA4, Google Ads, Cloudflare access
- [ ] Create URL redirect map (comprehensive)
- [ ] Set up conversion tracking code

### **Day 2 (Feb 2)**
- [ ] Update GoogleAnalytics.tsx with real GA4 ID
- [ ] Install Google Ads conversion tracking
- [ ] Create GA4 conversion events:
  - Contact form submissions
  - Phone clicks
  - Email clicks
  - "Get Started" CTA clicks
- [ ] Test tracking in dev environment

### **Day 3 (Feb 3)**
- [ ] Set up Google Search Console
- [ ] Verify domain ownership
- [ ] Create comprehensive 301 redirect list
- [ ] Test redirects in staging
- [ ] Performance optimization (Lighthouse audit)

### **Day 4 (Feb 4)**
- [ ] Final QA testing (all pages, all devices)
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Form testing (contact, newsletter)
- [ ] Mobile responsiveness check
- [ ] Link audit (verify no 404s)

### **Day 5 (Feb 5)**
- [ ] DNS preparation in Cloudflare
- [ ] SSL certificate verification
- [ ] Backup old site completely
- [ ] Stage DNS cutover plan
- [ ] Notify stakeholders of launch window

### **Day 6 (Feb 6) - LAUNCH DAY**
- [ ] **GO LIVE** (early morning for max uptime)
- [ ] Point www.airfreshmarketing.com DNS to new hosting
- [ ] Deploy 301 redirects
- [ ] Monitor traffic in real-time
- [ ] Verify GA4 tracking working
- [ ] Test critical user flows

### **Day 7 (Feb 7) - POST-LAUNCH**
- [ ] Monitor Search Console for crawl errors
- [ ] Fix any issues discovered
- [ ] Submit new sitemap to Search Console
- [ ] Monitor Google Ads conversion tracking
- [ ] Performance monitoring (page speed, uptime)

---

## 📈 CONVERSION TRACKING SETUP

### GA4 Events to Track
```javascript
// Contact Form
gtag('event', 'contact_form_submit', {
  'event_category': 'lead_generation',
  'event_label': 'contact_page'
});

// Phone Click
gtag('event', 'phone_click', {
  'event_category': 'contact',
  'event_label': 'header',
  'phone_number': '303-720-6060'
});

// Email Click
gtag('event', 'email_click', {
  'event_category': 'contact',
  'event_label': 'mailto'
});

// CTA Button Clicks
gtag('event', 'cta_click', {
  'event_category': 'engagement',
  'event_label': button_name,
  'value': 1
});
```

### Google Ads Conversion Tracking
```javascript
// Import conversion tag in <head>
gtag('config', 'AW-CONVERSION-ID');

// Fire on form submission
gtag('event', 'conversion', {
  'send_to': 'AW-CONVERSION-ID/CONVERSION-LABEL',
  'value': 1.0,
  'currency': 'USD'
});
```

---

## 🎯 GOOGLE ADS OPTIMIZATION

### Campaign Structure (Optimized for Tracking)
1. **Brand Campaign** - Target "AirFresh Marketing" terms
   - UTM: `?utm_source=google&utm_medium=cpc&utm_campaign=brand`

2. **Service Campaigns** (7 campaigns)
   - Brand Ambassadors
   - Event Staffing
   - Experiential Marketing
   - Street Teams
   - Promotional Models
   - Convention Staffing
   - Trade Shows
   - UTM: `?utm_source=google&utm_medium=cpc&utm_campaign=service-{name}`

3. **Geographic Campaigns** (Top 10 cities)
   - NYC, LA, Chicago, Miami, Denver, SF, Austin, Atlanta, Boston, Dallas
   - UTM: `?utm_source=google&utm_medium=cpc&utm_campaign=geo-{city}`

4. **City-Service Campaigns** (High-value combos)
   - Target: "{service} {city}" keywords
   - Landing pages: `/city-services/{city}-{service}`
   - UTM: `?utm_source=google&utm_medium=cpc&utm_campaign=combo-{city}-{service}`

### Lead Source Attribution
With UTM parameters + GA4 + Google Ads tracking, you'll see:
- **Which campaigns** generate leads
- **Cost per lead** for each campaign
- **Organic vs Paid** lead ratio
- **ROI** for that $5k/month Google Ads spend

**Dashboard View:**
```
Leads This Month: 45
├─ Organic Search: 28 (62%) - $0 cost
├─ Google Ads: 15 (33%) - $5,000 cost = $333/lead
└─ Direct/Other: 2 (5%)

Google Ads Breakdown:
├─ Brand Campaign: 5 leads @ $50/lead ✅
├─ Denver Campaign: 7 leads @ $150/lead ✅
├─ Service - Experiential: 2 leads @ $800/lead ⚠️
└─ Service - Brand Ambassadors: 1 lead @ $1,500/lead ❌ (pause/optimize)
```

---

## 🔒 RISK MITIGATION

### What Could Go Wrong
1. **SEO Ranking Drop** - Old URLs not redirected properly
   - **Mitigation:** Comprehensive 301 redirect mapping
   - **Backup:** Keep old site accessible at old.airfreshmarketing.com for 30 days

2. **Traffic Loss During DNS Change** - Propagation delay
   - **Mitigation:** Launch early morning, monitor closely
   - **Backup:** Cloudflare should handle this seamlessly

3. **Broken Forms/Conversions** - Code issues on live site
   - **Mitigation:** Extensive pre-launch testing
   - **Backup:** Quick rollback plan via Cloudflare

4. **GA4 Tracking Not Working** - Configuration error
   - **Mitigation:** Test in dev/staging first
   - **Backup:** Parallel tracking (old + new) for 7 days

5. **Google Ads Conversion Tracking Broken** - Lose attribution data
   - **Mitigation:** Test conversion tags before launch
   - **Backup:** Manual lead source tracking via form fields

---

## ✅ PRE-LAUNCH CHECKLIST

### Technical
- [ ] GA4 Measurement ID updated in code
- [ ] Google Ads conversion tracking installed
- [ ] All 301 redirects configured
- [ ] SSL certificate active and tested
- [ ] Sitemap.xml accessible at /sitemap.xml
- [ ] Robots.txt configured correctly
- [ ] Favicon working
- [ ] Performance score >90 (Lighthouse)

### Content
- [ ] All pages reviewed for accuracy
- [ ] No broken images
- [ ] No broken links (internal or external)
- [ ] Contact forms working
- [ ] Newsletter signup working
- [ ] Phone numbers clickable (tel: links)
- [ ] Email addresses clickable (mailto: links)

### SEO
- [ ] Unique meta titles for key pages
- [ ] Unique meta descriptions for key pages
- [ ] Schema markup added (LocalBusiness, Organization)
- [ ] Open Graph tags for social sharing
- [ ] Canonical tags set correctly
- [ ] Alt text on all images

### Analytics & Tracking
- [ ] GA4 tracking verified in real-time
- [ ] Conversion events firing correctly
- [ ] Google Ads conversion tracking tested
- [ ] UTM parameters working
- [ ] Event tracking for CTAs working

### Legal & Compliance
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] Cookie consent (if required)
- [ ] GDPR compliance (if applicable)

---

## 📞 IMMEDIATE ACTIONS REQUIRED FROM JOEY

**🔴 URGENT - Need TODAY:**
1. **Google Analytics Account**
   - Email address for account OR
   - Add pepper@hummingagent.ai as admin user OR
   - Share login credentials

2. **Google Ads Account**
   - Email address for account OR
   - Add pepper@hummingagent.ai as admin user OR
   - Share login credentials

3. **Cloudflare Account**
   - Login credentials OR
   - Add pepper@hummingagent.ai as team member

**Once I have access, I will:**
- Extract GA4 Measurement ID (2 min)
- Review current Google Ads campaigns (15 min)
- Set up DNS preparation in Cloudflare (30 min)
- Update all tracking code (1 hour)
- Launch within 3-5 days

---

## 🎯 SUCCESS METRICS (Post-Launch)

### Week 1
- ✅ Site live with zero downtime
- ✅ All redirects working (no 404 errors in Search Console)
- ✅ GA4 tracking verified
- ✅ Google Ads conversions tracking
- ✅ Contact form submissions coming through

### Month 1
- 📊 Baseline traffic established in GA4
- 📊 Lead source attribution working
- 📊 Google Ads ROI calculated
- 📊 Organic vs Paid lead ratio known
- 🎯 Decision: Keep/adjust/pause $5k Google Ads spend

### Month 3
- 📈 SEO rankings maintained or improved
- 📈 Organic traffic growing
- 📈 Google Ads optimized (pause low-ROI campaigns)
- 📈 Lead generation costs decreasing
- 🚀 Profitable, scalable marketing machine

---

**BOTTOM LINE:** We're 3-5 days from launch once I have GA/Ads/Cloudflare access. Site is ready. Just need credentials to finish integrations and flip the switch.
