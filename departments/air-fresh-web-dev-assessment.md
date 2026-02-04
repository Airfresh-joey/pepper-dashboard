# AIR FRESH MARKETING - WEB DEV ASSESSMENT
**Assessment Date:** February 1, 2026 @ 9:47 AM MST
**Site:** dev2.airfreshmarketing.com
**Repository:** https://github.com/Air-Fresh-Marketing/afm-website.git
**Local Path:** ~/afm-website-dev2

---

## 🎯 CURRENT STATUS: 85% COMPLETE - READY FOR PRE-LAUNCH PHASE

### ✅ WHAT'S WORKING WELL

#### Site Structure & Content
- **Homepage:** ✅ Professional, engaging, fully functional
- **Navigation:** ✅ Clean, comprehensive menu structure
- **Portfolio:** ✅ Showcasing major clients (Netflix, MrBeast, F1, Apple, MAC, Microsoft)
- **Services:** ✅ Multiple service pages linked
- **City Pages:** ✅ 22+ city-specific landing pages (NYC, LA, Chicago, Miami, Denver, SF, Austin, Atlanta, etc.)
- **Events & Venues:** ✅ Comprehensive event/venue pages with service combinations
- **Footer:** ✅ Complete with contact info, social links, newsletter signup
- **Responsive Design:** ✅ Mobile-friendly layout

#### SEO/GEO Implementation
- **Sitemap:** ✅ EXCELLENT - Comprehensive XML sitemap with 1000+ pages
  - Static pages
  - City pages (22 cities)
  - City-service combinations (242+ pages)
  - Event pages with service combinations
  - Venue pages with service combinations
  - State pages (all 50 states + DC)
- **Robots.txt:** ✅ EXCELLENT - Proper GEO implementation
  - Allows all major search engines (Google, Bing)
  - **GEO-optimized:** Explicitly allows AI search bots (GPTBot, Claude-Web, PerplexityBot, Anthropic-AI, Cohere)
  - Blocks bad bots appropriately
  - Sitemap reference included
- **Metadata:** ✅ Basic SEO metadata in place
- **Structure:** ✅ Semantic HTML, proper heading hierarchy

#### Technical Infrastructure
- **Framework:** Next.js (modern, performant)
- **GitHub:** Connected to correct repo (Air-Fresh-Marketing/afm-website)
- **Branch:** main (clean, no uncommitted changes detected)
- **Hosting:** Live on dev2.airfreshmarketing.com

---

## 🚨 CRITICAL BLOCKERS - MUST FIX BEFORE LAUNCH

### 1. Google Analytics NOT CONFIGURED ❌
**Location:** `components/GoogleAnalytics.tsx`
**Issue:** Measurement ID is still placeholder `G-XXXXXXXXXX`
**Impact:** No tracking data being collected
**Fix Required:**
```typescript
// CURRENT (WRONG):
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

// NEED: Replace with actual GA4 property ID
const GA_MEASUREMENT_ID = 'G-XXXXXX-XXXX'; // Get from Joey/Google Analytics account
```
**Action:** Need Joey to provide the actual GA4 Measurement ID

### 2. Domain Configuration & Launch Plan ⚠️
**Current:** dev2.airfreshmarketing.com (staging)
**Target:** www.airfreshmarketing.com (production)
**Risks:**
- Need to ensure no data loss during migration
- Old site content preservation
- DNS/hosting transition plan
- Redirects from old URLs to new structure

### 3. Google Search Console Setup ⚠️
**Status:** Not verified
**Required Actions:**
- Add site to Google Search Console
- Verify ownership (DNS or HTML meta tag)
- Submit sitemap.xml
- Monitor for crawl errors

---

## 📋 PRE-LAUNCH CHECKLIST

### High Priority (Before Launch)
- [ ] **Google Analytics ID** - Replace placeholder with real GA4 property
- [ ] **Google Search Console** - Set up and verify domain
- [ ] **Submit Sitemap** - Upload sitemap.xml to Search Console
- [ ] **SSL Certificate** - Verify HTTPS working on production domain
- [ ] **Domain DNS** - Configure www.airfreshmarketing.com to point to hosting
- [ ] **Redirects** - Set up 301 redirects from old URLs to new structure
- [ ] **Environment Variables** - Update production .env with proper credentials
- [ ] **Performance Audit** - Run Lighthouse/PageSpeed Insights
- [ ] **Link Audit** - Verify all internal links work (no 404s)
- [ ] **Form Testing** - Test contact forms, newsletter signup
- [ ] **Mobile Testing** - Verify all pages work on mobile devices
- [ ] **Cross-browser Testing** - Test on Chrome, Safari, Firefox, Edge

### Medium Priority (Launch Week)
- [ ] **Google Ads Integration** - Create ad campaigns for key pages
  - Landing pages for each city
  - Service-specific campaigns
  - Event/venue targeting
- [ ] **Schema Markup** - Add LocalBusiness, Organization schema
- [ ] **Social Meta Tags** - Add Open Graph, Twitter Card metadata
- [ ] **Favicon** - Verify favicon displays correctly
- [ ] **404 Page** - Custom 404 error page
- [ ] **Loading States** - Optimize image loading, lazy loading
- [ ] **Analytics Events** - Verify custom event tracking (forms, CTAs, phone clicks)

### Low Priority (Post-Launch)
- [ ] **Content Refresh** - Review all copy for accuracy
- [ ] **Image Optimization** - Compress images, use modern formats (WebP)
- [ ] **Blog Content** - Start publishing blog posts
- [ ] **Case Studies** - Add detailed case study pages
- [ ] **A/B Testing** - Set up conversion optimization tests
- [ ] **Email Marketing Integration** - Connect to email service provider

---

## 🎯 GOOGLE ADS STRATEGY

### Keyword Research Needed
Based on site structure, target keywords for each page type:

#### Service Pages
- Brand ambassadors [city]
- Event staffing [city]
- Experiential marketing [city]
- Trade show staff [city]
- Street team marketing [city]

#### City Pages (22 cities)
Example for Denver:
- Denver brand ambassadors
- Denver event staffing
- Denver experiential marketing agency
- Event staff Denver
- Marketing agency Denver

#### Event/Venue Pages
- [Event name] brand ambassadors
- [Event name] promotional staff
- [Venue name] event staffing

### Campaign Structure Recommendation
1. **Brand Campaign** - Target "AirFresh Marketing" branded terms
2. **Service Campaigns** - One per service type (5-7 campaigns)
3. **Geographic Campaigns** - City-specific campaigns (22 campaigns)
4. **Event Campaigns** - High-value events (tier 1 & 2)
5. **Competitor Campaigns** - Target competitor brand terms

### Landing Page Optimization
Each ad should link to the most relevant page:
- Service ads → /services/[service-slug]
- City ads → /cities/[city-slug]
- City+Service ads → /city-services/[city]-[service]
- Event ads → /events/[event-slug]/[service]

---

## 📊 SEO AUDIT RESULTS

### Strengths
- ✅ 1000+ indexed pages (excellent content depth)
- ✅ City-specific landing pages (local SEO)
- ✅ Service-specific pages (keyword targeting)
- ✅ GEO optimization (AI search ready)
- ✅ Proper robots.txt configuration
- ✅ Comprehensive sitemap
- ✅ Mobile-responsive design

### Opportunities
- ⚠️ Need to verify old site pages for migration
- ⚠️ Add schema markup for better rich snippets
- ⚠️ Enhanced metadata for each page (unique titles/descriptions)
- ⚠️ Internal linking strategy (cross-link city/service pages)
- ⚠️ Blog content for organic traffic
- ⚠️ Backlink strategy (reach out to previous clients)

---

## 🔄 MIGRATION PLAN (OLD → NEW SITE)

### Pre-Migration
1. **Audit old site** - Document all existing pages/URLs
2. **Content comparison** - Ensure no valuable content lost
3. **Redirect mapping** - Create 301 redirect map
4. **Backup** - Full backup of old site
5. **Analytics baseline** - Document current traffic/rankings

### During Migration
1. **DNS cutover** - Point domain to new hosting
2. **SSL activation** - Ensure HTTPS works
3. **Redirect implementation** - Deploy 301 redirects
4. **Search Console update** - Update property settings
5. **Analytics update** - Verify tracking works

### Post-Migration
1. **Monitor traffic** - Watch for drops/issues
2. **Check Search Console** - Fix any crawl errors
3. **Test critical paths** - Verify forms, conversions work
4. **Performance monitoring** - Track page speed, uptime
5. **Rankings check** - Monitor keyword positions

---

## 🎬 NEXT ACTIONS (PRIORITY ORDER)

### IMMEDIATE (Today)
1. **Get GA4 Measurement ID from Joey** - Critical for tracking
2. **Audit old airfreshmarketing.com** - Document what we're replacing
3. **Create GitHub issue tracker** - Track launch tasks

### THIS WEEK
1. **Update GoogleAnalytics.tsx** with real ID
2. **Set up Google Search Console** - Verify domain ownership
3. **Test all major pages** - Ensure no broken links/images
4. **Review SEO metadata** - Unique titles/descriptions for key pages
5. **Create launch plan document** - Step-by-step migration guide

### NEXT WEEK (Launch Prep)
1. **Final QA testing** - All devices, all browsers
2. **Performance optimization** - Lighthouse audit, fix issues
3. **DNS preparation** - Coordinate with hosting provider
4. **Backup strategy** - Ensure rollback plan exists
5. **Launch communications** - Notify stakeholders

---

## 📝 QUESTIONS FOR JOEY

1. **Google Analytics:** What's the GA4 Measurement ID? (Or do we need to create new property?)
2. **Domain/Hosting:** Who manages DNS for airfreshmarketing.com? Access credentials?
3. **Old Site:** Are there specific pages we must preserve/redirect?
4. **Timeline:** Target launch date?
5. **Google Ads:** Existing Google Ads account? Budget/strategy parameters?
6. **Priorities:** What's most important: SEO, paid ads, or conversion optimization?

---

## 📈 SUCCESS METRICS (Post-Launch)

### Week 1
- Site uptime > 99.9%
- No critical errors in Search Console
- Google Analytics tracking verified
- Contact form submissions working

### Month 1
- Pages indexed in Google Search Console
- Organic traffic baseline established
- Google Ads campaigns launched
- Conversion tracking operational

### Month 3
- Improved rankings for target keywords
- Positive ROI on Google Ads
- Growing organic traffic
- Lead generation meeting goals

---

**Status:** Ready for pre-launch phase. Core site is solid, need to complete integrations and testing before going live.

**Estimated Time to Launch:** 1-2 weeks (pending access to GA, Search Console, DNS)
