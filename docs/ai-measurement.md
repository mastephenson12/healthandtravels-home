# AI visibility and referral measurement

Implemented November 13, 2026. Property: `G-DKH3PF8GEJ`. Script installed on 6 selected entry, guide and resource pages. This is initial coverage, not every page or external service.

## Three separate measures

1. Citation visibility: use `ai-visibility-benchmark.json`. Run the same unbranded questions in fresh platform conversations with search enabled. Record the actual cited URL, date, mode and evidence. A mention and a citation are separate. No runs have been recorded yet. Rate = prompts citing our domain / prompts actually tested, per platform and run. Repeated runs can vary.
2. Identifiable visits: `ai_referral_visit` is a page landing with a recognized `utm_source` or referrer host. It is not unique people, AI impressions, every AI visit or proof of a recommendation. Missing referral metadata stays unclassified. Google/Bing search is not automatically labeled AI. Tags can be copied or spoofed.
3. Useful actions: `site_action` records selected link clicks, using `action_name`. Handoffs do not prove a newsletter signup, completed trip, membership sale or submitted lead.

## Reporting in GA4

Use Reports > Acquisition > Traffic acquisition with Session source / medium, and Explore for a landing-page and event breakdown. Register event-scoped custom dimensions in Admin > Custom definitions: `ai_platform`, `attribution_evidence`, `action_name`, `site_name`. Use session segments based on recognized Session source values to compare action events for those sessions. The custom landing event identifies additional referral evidence; it does not rewrite GA attribution.

After processing, inspect `ai_referral_visit`, `site_action` and actual completion events. Only mark a true business outcome as a key event after validating it. Do not mark all handoffs as leads. Reports start with collected data; there is no historical backfill. Do not register test visits as real user results.

## Outcomes currently covered

`site_action` includes Sage, newsletter and AHA membership handoffs. `outing_saved` fires when the existing adventure-board save succeeds. Existing homepage finder/shortlist events remain. Actual Sage itinerary saves, Beehiiv signups and AHA purchases require verification in their own systems; this change does not claim those completions.

## Privacy and limits

Custom events contain fixed labels and the current pathname, not query strings, form fields, estimate text, documents, email addresses or full outbound URLs. No new session/local storage is used for attribution. The script uses the existing GA property and initializes its tag on covered pages without one. Existing consent settings still govern Google tags; the new script skips GPC/DNT requests. Existing tags and enhanced-measurement settings are outside this change. Blockers, consent, referral stripping and cross-domain boundaries can reduce visibility.

## Review cadence

Compare weekly over a rolling 28-day window: identifiable AI traffic, top entry pages, action events and independently verified business outcomes. Re-run the fixed prompt set monthly and after substantial content changes; do not interpret small changes as causal proof. Keep citation results separate from traffic.

## Access still required

No GA4 Admin or Search Console configuration was changed or verified in the signed-in account. Register dimensions and verify Realtime/DebugView receipt before relying on reports. Google Search Console's current Generative AI reports should be inspected separately where available; GA referral data alone does not separate AI Overviews from ordinary Google visits. No recurring task has been created.

Sources: https://developers.google.com/analytics/devguides/collection/ga4/events ; https://support.google.com/analytics/answer/12229021 ; https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports
