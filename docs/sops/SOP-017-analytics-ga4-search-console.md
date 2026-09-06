# SOP 017 — Analytics, GA4 & Google Search Console

## Purpose
Create one repeatable measurement system for Health & Travels, Sage, the newsletter, and Arizona Hikers Association so decisions are based on actual user behavior instead of vibes wearing a spreadsheet costume.

## Trigger
Use this SOP when reviewing performance, launching a new page or funnel, adding tracking, diagnosing traffic changes, or planning growth priorities.

## Owner
Health & Travels Analytics / Growth Operator.

## Core Measurement Model
Track the full journey:

Discover → Engage → Plan → Subscribe → Join → Return

## Primary Systems
- Google Analytics 4
- Google Search Console
- Beehiiv analytics
- Sage event tracking
- AHA / GoHighLevel funnel metrics
- Affiliate partner dashboards

## GA4 Standard
Use the intended GA4 property consistently across the Health & Travels ecosystem wherever technically appropriate.

Track at minimum:
- Page views
- Sessions
- Traffic source / medium
- Landing pages
- Engagement
- Outbound network clicks
- Sage planner clicks
- Newsletter clicks/signups where available
- AHA membership clicks
- Key conversion events

## Recommended Event Naming
Use stable, descriptive names. Examples:
- adventure_planner_click
- brand_network_click
- newsletter_signup
- starter_pack_signup
- trip_builder_start
- trip_builder_complete
- itinerary_email_request
- aha_membership_click
- aha_checkout_start
- aha_membership_purchase
- affiliate_click

Do not casually rename events after launch. Analytics becomes surprisingly useless when five names describe the same human action.

## UTM Standard
Use UTMs for cross-domain campaigns and outbound campaign links where useful.

Recommended structure:
- utm_source = originating platform/site
- utm_medium = navigation, email, social, referral, cpc, etc.
- utm_campaign = campaign or funnel name
- utm_content = placement or creative identifier

Keep naming lowercase and consistent.

## New Page Launch Check
After publishing a new page:
1. Confirm the page loads.
2. Confirm GA4 is firing where applicable.
3. Confirm intended CTA events fire.
4. Confirm canonical URL.
5. Confirm page is internally linked.
6. Confirm sitemap inclusion when required.
7. Check Google Search Console indexing status after discovery.
8. Record publication date for later comparison.

## Google Search Console Workflow
Review:
- Indexing status
- Sitemap status
- Page indexing reasons
- Search queries
- Impressions
- Clicks
- CTR
- Average position
- Top landing pages

When a page is not indexed, classify the reason before changing anything.

Common examples:
- Page with redirect
- Blocked by robots.txt
- Crawled, currently not indexed
- Discovered, currently not indexed
- Duplicate/canonical issue
- Not found (404)

Do not "fix" intentional redirects or intentionally blocked pages merely because Search Console lists them. Machines are very good at reporting things without knowing whether anyone should care.

## Search Performance Review
For important pages, evaluate:
- Impressions increasing or decreasing
- Clicks increasing or decreasing
- CTR relative to position
- Query relevance
- Whether page intent matches search demand
- Whether title/meta need improvement
- Internal link opportunities
- Content freshness

## Funnel Measurement
Track movement between properties when possible:

### Health & Travels
- Organic landing sessions
- Guide engagement
- Clicks to Sage
- Newsletter signups
- AHA clicks

### Sage
- Planner starts
- Planner completions
- Destination selection
- Itinerary creation
- Email itinerary requests
- Return visits

### Newsletter
- New subscribers
- Source of signup
- Open rate
- Click rate
- Unsubscribe rate
- Clicks back to H&T
- Clicks to Sage
- Clicks to AHA

### Arizona Hikers Association
- Membership page visits
- Checkout starts
- Purchases
- Monthly vs annual mix
- Activation / community access
- Retention / churn

## Weekly Review
Once per week, review:
- Search traffic trend
- Top new/declining pages
- New subscribers
- Sage planner usage
- AHA membership activity
- Technical anomalies

Keep the weekly review focused. Do not create an 84-metric dashboard whose principal achievement is becoming another thing nobody reads.

## Monthly Review
Once per month, review:
- Organic growth
- Best-performing content clusters
- Conversion rates by source
- Sage completion rate
- Subscriber growth
- AHA acquisition and churn
- Affiliate revenue by page/partner
- Pages needing refresh
- Indexing issues
- Technical problems

## Decision Rules
Use data to decide what to do more of.

Examples:
- High impressions + low CTR → improve title/meta/intent match.
- Good traffic + low Sage clicks → improve planning CTA.
- Good Sage starts + low completion → investigate UX/friction.
- Good newsletter signups + weak return traffic → improve email content/CTAs.
- Good AHA page traffic + poor checkout → inspect offer clarity and checkout friction.
- High-performing destination cluster → publish supporting content and internal links.

## Data Quality Check
Before trusting a metric:
- Confirm date range.
- Confirm property/account.
- Confirm event definition.
- Confirm filters.
- Check whether tracking recently changed.
- Distinguish users, sessions, events, and conversions.

## Privacy & Security
- Do not send sensitive personal information into analytics event parameters.
- Do not put API keys, secrets, or private user data in public repo files.
- Follow applicable consent/privacy requirements for analytics and marketing tools.

## Metrics That Matter Most
If the dashboard becomes overwhelming, return to:
1. Organic search clicks
2. Useful page engagement
3. Sage planner completions
4. Email subscribers
5. AHA paid members
6. Retention
7. Revenue

## Success Standard
Analytics should answer three questions:

1. How are people finding us?
2. Are we helping them move to the next useful step?
3. Which activities create repeat users, members, or revenue?

If a metric does not help answer one of those questions or diagnose a known problem, it probably does not deserve much attention.
