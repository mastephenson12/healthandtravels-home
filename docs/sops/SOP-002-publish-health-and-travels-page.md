# SOP 002 — Publish a New Health & Travels Page

## Purpose
Create and publish useful, trustworthy Arizona family-adventure content that attracts search traffic, helps the reader make a decision, and naturally connects Health & Travels to Sage and Arizona Hikers Association.

## Trigger
Use when a new Health & Travels page, destination guide, safety article, checklist, seasonal guide, or family-adventure resource is approved.

## Owner
Health & Travels content operator or Content Builder GPT following this SOP.

## Inputs
- Primary topic or keyword
- Target audience
- Search intent
- Destination or problem being addressed
- Firsthand photos if available
- Reliable sources for current facts
- Relevant Sage page or planner destination
- Relevant AHA next step if appropriate

## Steps

### 1. Define the job of the page
Write one sentence describing what the visitor should know, decide, or do after reading.

### 2. Research current facts
Verify any information that can change, including:
- Closures and access
- Fees
- Hours
- Weather or seasonal risks
- Parking
- Trail conditions
- Amenities
- Regulations

Prefer official sources for safety and access information.

### 3. Build the page around user intent
For destination content, default order is:
1. Outdoor places to explore
2. Places to eat
3. Places to stay
4. Family-planning details
5. Safety considerations
6. Sage planning CTA

For safety or how-to content, lead with the answer and practical action rather than promotional material.

### 4. Add family-fit information
Include what is relevant:
- Difficulty
- Distance
- Elevation
- Shade
- Bathrooms
- Stroller suitability
- Water availability
- Child age/experience considerations
- Drive time
- Seasonal concerns
- Backup plan

### 5. Add firsthand media
When approved original photos exist:
- Prefer them over generic stock imagery
- Use descriptive filenames and alt text
- Optimize through Cloudinary when practical
- Do not mislabel surrounding scenery as being on a trail or attraction when it is not

### 6. Add Health & Travels trust signals
Where appropriate:
- Author/byline
- Date published or updated
- Firsthand field notes
- Editorial standards link
- Source links
- Clear distinction between general information and individualized medical advice when health topics are involved

### 7. Add the next step
Every page should have a logical continuation.

Default ecosystem logic:
- **Explore**: related Health & Travels guides
- **Plan**: Sage when personalization helps
- **Join**: AHA when community, events, or recurring resources are relevant

Do not force all three CTAs onto every page if they do not fit the reader's intent.

### 8. SEO setup
Add:
- Unique title tag
- Meta description
- Canonical URL
- One clear H1
- Logical H2/H3 hierarchy
- Descriptive internal links
- Image alt text
- Structured data when appropriate
- Related pages

### 9. Internal linking
Link to relevant:
- Destination hub
- Safety guides
- Day-hike checklist
- Related destinations
- Sage planner or destination
- AHA only where it logically fits

### 10. Technical publishing
Before commit:
- Confirm links are correct
- Confirm HTML renders logically
- Confirm no secret/API keys are present
- Confirm canonical path matches intended URL
- Confirm mobile layout will remain readable

Commit the page to GitHub using a descriptive commit message.

### 11. Deployment check
After the Vercel deployment:
- Confirm HTTP 200
- Check desktop and mobile layout
- Test primary CTA links
- Confirm images load
- Confirm title/meta/canonical
- Check for obvious console or rendering errors when possible

### 12. Discovery and distribution
After publishing:
- Add page to sitemap if required by the site structure
- Ensure internal links point to the page
- Request indexing in Search Console when useful
- Repurpose into social content or newsletter content when appropriate

## Quality check
A page is not complete until these questions are answered:
- Does it satisfy the search intent quickly?
- Is current/safety-sensitive information verified?
- Would a parent know whether this fits their family?
- Is the next step obvious?
- Are there useful internal links?
- Does Sage appear when planning would help?
- Is AHA introduced only when relevant?
- Is the page usable on mobile?
- Are metadata and canonical URL correct?
- Are original photos represented accurately?

## Output
A live, indexed-ready Health & Travels page that serves the reader first and strengthens the Explore → Plan → Join ecosystem.

## Next step
Measure performance and improve the page based on search impressions, clicks, engagement, planner activity, and conversions.

## Metrics
- Google impressions
- Organic clicks
- CTR
- Average search position
- Engaged sessions
- Internal-link clicks
- Sage clicks
- Newsletter signups
- AHA referral clicks
- Membership conversions attributed to the page when measurable
