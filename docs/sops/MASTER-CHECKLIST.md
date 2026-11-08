# Health & Travels Master Operating Checklist

Use this page as the recurring control panel for the ecosystem.

## Weekly Checklist

### Sites + Funnel
- [ ] Health & Travels homepage loads normally
- [ ] Recent article/destination page loads normally
- [ ] Sage plan flow works on desktop
- [ ] Sage plan flow works on Android/mobile
- [ ] Newsletter signup works
- [ ] AHA join page works
- [ ] AHA checkout/community handoff works
- [ ] H&T → Sage CTA works
- [ ] H&T → AHA CTA works

### Publishing + Technical
- [ ] Latest Vercel production deploys succeeded
- [ ] No unresolved failed builds
- [ ] Recent GitHub commits reviewed
- [ ] Open PRs reviewed
- [ ] No secrets/credentials committed
- [ ] Key internal links still resolve

### Search + Analytics
- [ ] Search Console checked for indexing changes
- [ ] Sitemap status checked
- [ ] Manual actions/security messages checked
- [ ] GA4 checked for major traffic anomalies
- [ ] Sage funnel activity checked
- [ ] Newsletter conversion activity checked if tracked
- [ ] AHA join traffic checked

### Email + Community
- [ ] Beehiiv subscriber trend checked
- [ ] Bounce/unsubscribe anomalies checked
- [ ] Welcome automation checked
- [ ] AHA onboarding automation checked
- [ ] Community access problems reviewed

### Media + Security
- [ ] Recent Cloudinary uploads reviewed
- [ ] Rights/privacy metadata acceptable
- [ ] SSL/domain/DNS appear healthy
- [ ] Suspicious-access notices reviewed
- [ ] 2FA remains enabled on critical accounts
- [ ] Any exposed/reused credentials flagged for rotation

### Weekly Output
- [ ] Issues documented
- [ ] Severity assigned
- [ ] Owner assigned
- [ ] Next action defined
- [ ] Target date defined

---

## Monthly Checklist

### Traffic + Search
- [ ] Total sessions recorded
- [ ] Organic clicks recorded
- [ ] Organic impressions recorded
- [ ] Top landing pages identified
- [ ] High-impression / low-CTR pages identified

### Newsletter
- [ ] New subscribers recorded
- [ ] Subscriber source reviewed
- [ ] Best-performing newsletter identified
- [ ] Newsletter clicks to H&T / Sage / AHA reviewed

### Sage
- [ ] Sage visits recorded
- [ ] Trip-builder starts recorded
- [ ] Completions recorded if available
- [ ] Biggest mobile/UX friction identified

### Arizona Hikers Association
- [ ] Join-page visits recorded
- [ ] Checkout starts recorded
- [ ] Memberships sold recorded
- [ ] Monthly vs annual mix recorded
- [ ] Cancellations/churn reviewed
- [ ] Community engagement reviewed

### Revenue
- [ ] AHA revenue recorded
- [ ] Affiliate clicks recorded
- [ ] Affiliate revenue recorded
- [ ] Ad revenue recorded if active
- [ ] Sponsorship/partner revenue recorded if active
- [ ] Total monthly revenue calculated

### Decisions
- [ ] Best-performing asset identified
- [ ] Biggest funnel bottleneck identified
- [ ] One low-value activity to stop/deprioritize identified
- [ ] One growth test selected
- [ ] Next month’s top 3 priorities selected

## Rule
If the checklist repeatedly uncovers the same problem, fix the system or update the SOP. Repeated heroics are just undocumented process failure wearing a cape.


---

## Change Completion Gate (required for every improvement)

**Status vocabulary**
- **Not started**: no work performed.
- **Changed in source**: saved in GitHub or the relevant app; public experience not yet confirmed.
- **Live verified**: public page or actual end-to-end flow checked after deployment; record the URL, date, and test result.
- **Blocked / needs owner access**: cannot independently inspect or complete a step; record exactly what access or action is missing.
- **Failed verification**: check failed; keep the issue open and record the next repair.

**For each change, record:** date (Arizona time), area, original problem, changed file or setting, commit/record URL, live URL, verification method and result, remaining related surfaces, owner, next action. Never say “done,” “fixed,” or “live” based only on a code change or an indexed search snippet.

**Four-step closeout**
1. **Build:** make the smallest useful change.
2. **Verify:** inspect the actual visitor experience and test the primary CTA on desktop/mobile where relevant.
3. **Sweep:** search related pages, templates, forms, automated emails, social profiles and scheduled content for contradictory promises.
4. **Document:** update the operations dashboard with verified evidence and any remaining blocker.

### Newsletter cadence consistency sweep — 2026-11-08

Canonical promise: **One free newsletter every Monday with Arizona family adventure ideas and practical planning tips.**

| Surface | Current evidence | Status | Next action |
|---|---|---|---|
| Website About page source (`about.html`) | Says “free Monday newsletter” and “one free newsletter every Monday” | Source checked; live visit not recorded in this sweep | Confirm public About page after deploy and signup CTA |
| Newsletter SOP (`SOP-009-beehiiv-newsletter.md`) | Specifies one Monday edition, no recurring Friday edition | Source checked | Keep in sync with Beehiiv |
| Beehiiv publication description and signup page | Not inspected with authenticated Beehiiv access | Blocked / needs owner access | Check displayed cadence and signup |
| Beehiiv welcome sequence, automations, templates, scheduled posts | Not inspected with authenticated Beehiiv access | Blocked / needs owner access | Search for Monday/Friday, twice-weekly, Tuesday/Friday, and similar legacy promises |
| Website-wide pages and social bios | Not exhaustively audited | Not started | Search relevant surfaces; change only verified contradictions |

**Evidence rule:** Search-engine results can be stale. Recheck current source and the live page before declaring an inconsistency. Never treat unchecked Beehiiv settings as confirmed correct.
