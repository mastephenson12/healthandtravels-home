# SOP 018 — Weekly Site Health + Security Review

## Purpose
Run a repeatable weekly review that keeps Health & Travels, Sage, newsletter integrations, and Arizona Hikers Association healthy, secure, and functioning for real users.

## Trigger
- Once per week on a scheduled day
- Any time there is unusual downtime, broken forms, indexing loss, or suspicious account activity

## Owner
Operations owner or delegated technical operator

## Scope
- `healthandtravels.com`
- `sage.healthandtravels.com`
- newsletter entry points and signup flows
- Arizona Hikers Association join and community entry points
- supporting services including Vercel, GitHub, Cloudinary, GA4, Search Console, Beehiiv, GoHighLevel, email infrastructure, and domains/DNS

## Weekly Review Checklist
1. Confirm Health & Travels, Sage, AHA join, and newsletter entry points load normally.
2. Test the core paths: H&T → Sage, H&T → newsletter, H&T → AHA, Sage → trip-builder, AHA → checkout/community.
3. Review recent Vercel deployments and failed builds.
4. Review recent GitHub commits and open pull requests; verify no secrets were committed.
5. Review Search Console for indexing drops, sitemap problems, security issues, or manual actions.
6. Review GA4 for large traffic anomalies and funnel breakage.
7. Review Beehiiv for signup, bounce, unsubscribe, or automation problems.
8. Review GoHighLevel/AHA checkout, onboarding, and community-access health.
9. Review recent Cloudinary uploads for naming, rights, privacy, and obvious misuse.
10. Check domains, SSL, DNS, and email deliverability basics.
11. Confirm 2FA on critical accounts and review suspicious-access notices.
12. Create or update an issue/task for every meaningful problem found.

## Escalate Immediately
- site down
- checkout broken
- major signup path broken
- Search Console security/manual-action warning
- credential or environment-variable leak
- suspicious account access
- repeated failed deploys preventing production fixes

## Output
A weekly operating note with date, systems checked, issues, severity, owner, next action, and target date.

## Metrics
- uptime/reliability
- weekly issues found
- time to resolution
- organic traffic trend
- signup and membership conversion continuity
- security incidents
