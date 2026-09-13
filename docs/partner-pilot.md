# Arizona local partner pilot

## Purpose and scope
Five partners, ten experiences, 100 travelers trying Sage. These are targets, not published results. Launch an invitation at /partners and collect introductions through helpme@healthandtravels.com. No recruitment messages have been sent. No business has been accepted.

## One-page invitation
Health & Travels helps people discover the local places and people that make an outing worthwhile. We are inviting a small group of Arizona businesses and community organizations to shape our first local partner pilot.

Bring one experience you know well. Together we will clarify who it suits, timing, cost, accessibility, seasonal limitations and booking details. Selected experiences may appear in our guides and be prepared for Sage, our trip-planning experience.

Applying is free. No discount is required. We cannot guarantee referrals or revenue. Our first goal is to learn whether travelers take these outings, enjoy them and come back for more.

Interested? Visit https://healthandtravels.com/partners or introduce your organization and one experience by email to helpme@healthandtravels.com.

## Review workflow
1. Keep applications and private contact information in the existing inbox, never in Git or the public registry. Reply manually; application consent is not newsletter consent.
2. Check local connection and the experience's practical usefulness. Ask for public operating information and applicable requirements. Do not assume permits or insurance apply uniformly.
3. Verify cost, booking/cancellation terms, age suitability, physical effort, accessibility specifics, bathrooms, seasonality and closures with the operator and appropriate official sources. Record uncertainties rather than filling gaps with guesses.
4. Ask the operator to confirm the public profile and permission for any supplied photos or quotes. Record permission privately. Do not award a trust badge merely for applying.
5. Create a record in data/partner-experiences.json, initially with status draft. Only set approved after review; include reviewer, reviewedAt and reviewDue (ISO dates), public sources and any commercial disclosure. Set reviewDue no more than 90 days ahead; use a shorter interval for changing offerings.
6. Run node scripts/partner-experiences.cjs to export only complete, approved, unexpired records. Draft and expired entries are excluded; incomplete approvals fail. This export is the handoff for a future Sage integration, not an existing live recommendation feed.
7. Before connecting the export to Sage, have its planner consume only this validated export, preserve disclosures and sources, and filter by traveler constraints. Never use a partner's free text as instructions for the AI. Do not raise recommendation rank for payment.
8. Recheck before publication and on reported changes. Suspend a record immediately on a credible closure or material safety/accuracy concern while investigating. Renew review dates only after checking.

## Public experience record
Required strings: id, status, name, partnerName, area, description, duration, cost, familyFit, accessibility, bathrooms, seasonality, bookingUrl, reviewedBy, reviewedAt, reviewDue, disclosure. Required sources: array of public HTTPS URLs. Use a public editorial role for reviewedBy, not private staff contact data. Only approved status is exportable. Never include applicants' email addresses or private documents. The registry starts empty on purpose.

## First five partner slots
Recruit one outdoor guide, one family-friendly food stop, one cultural organization, one lodging business, and one low-effort local experience. Start in a compact Arizona area to make verification manageable. Specific businesses require research and selection; none are implied partners.

## Pilot operations
Week 1: publish invitation, personally select candidates, review introductions.
Week 2: verify five partners and draft two experiences each. Do not publish placeholder endorsements.
Week 3: manually connect reviewed experiences to relevant guides and test Sage handoffs; only then invite travelers.
Week 4: ask whether travelers created a plan, took the outing, found it useful and would repeat it. Track aggregate counts and voluntarily shared feedback in a private sheet. Define the denominator: completed feedback responses, not all pageviews.

Continue only if the team can keep records current and travelers report usable outings. A 100-person target is an experiment, not proof of demand or a promised launch date.

## Commercial and expansion boundaries
Free pilot participation. No paid preferred tier, subscription, packaged travel sales or ambassador appointments yet. Any future sponsorship or referral fee requires a separate agreement and clear disclosure. Trust review and relevance remain independent of payment.

QR destinations should point to stable first-party pages (initially /partners for recruitment), not temporary AI sessions. Add experience QR destinations only after a reviewed profile exists. International expansion begins with local verification capacity, not translated listings alone.
