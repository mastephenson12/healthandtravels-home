# SOP 007 — GitHub + Vercel Publishing

## Purpose
Publish Health & Travels changes safely and consistently from GitHub to Vercel without breaking live pages, losing redirects, or discovering after dinner that a deployment quietly failed six hours earlier.

## Trigger
Use whenever code, content, routes, styles, configuration, redirects, sitemap files, or other production assets are changed.

## Owner
Health & Travels Technical Operator.

## Inputs
- Approved page or code change
- Correct repository
- Target branch
- Relevant environment/config requirements
- Known affected routes
- Test plan

## Standard Flow
Draft / Edit → Review → Commit → Deploy → Verify → Monitor

## Process

### 1. Confirm the Correct Repository
Before changing anything, verify the repository and project being edited.

For Health & Travels homepage/content work, use the repository connected to the production Health & Travels Vercel project.

Do not assume similarly named repositories deploy to the same site.

### 2. Check the Existing File First
Before replacing an existing file:
- Fetch/read the current version
- Preserve required analytics
- Preserve canonical tags
- Preserve navigation
- Preserve structured data
- Preserve ad or affiliate disclosures when relevant
- Preserve working redirects and tracking parameters

### 3. Use a Branch for Material Changes
For meaningful structural, code, routing, or multi-file changes:
- Create a descriptive branch
- Commit related changes together
- Open a pull request
- Review the diff before merge

Small, low-risk content fixes may go directly to main when appropriate.

### 4. Commit Clearly
Commit messages should explain the outcome, not merely say "update."

Good examples:
- Add Sedona family weekend guide
- Fix Sage CTA routing on homepage
- Add German Papago Park localization
- Update monsoon safety guidance

### 5. Never Commit Secrets
Do not commit:
- API keys
- private tokens
- passwords
- service-account credentials
- webhook secrets
- private environment variables

Secrets belong in environment-variable management such as Vercel project settings or the relevant service.

If a secret is accidentally committed, treat it as compromised and rotate it.

### 6. Merge or Push to the Production Branch
Confirm the Vercel project is configured to deploy from the intended production branch, usually main.

### 7. Verify the Vercel Deployment
After the production branch changes:
- Confirm a deployment was created
- Confirm build status is successful
- Review build logs when the deployment fails
- Confirm the correct domain is attached

Do not assume a GitHub commit means the live site changed.

### 8. Test the Live Route
Open the production URL and verify:
- Page returns successfully
- Layout works on desktop
- Layout works on mobile
- Images load
- Navigation works
- Sage CTA works
- Newsletter CTA works
- AHA CTA works when present
- No obvious JavaScript error breaks interaction

### 9. Test High-Risk Changes
For routing/config changes additionally verify:
- Redirect targets
- Canonical URL
- robots behavior
- sitemap behavior
- 404 behavior
- www/non-www handling
- subdomain links

### 10. Check Analytics
When links or CTAs changed:
- Ensure GA4 remains installed
- Preserve event tracking attributes or scripts
- Verify important CTA links still contain expected UTM parameters where used

### 11. Search Engine Check
For a new indexable page:
- Confirm the URL is present in the sitemap if required
- Confirm robots.txt does not block it
- Confirm there is no accidental noindex
- Confirm canonical points to the intended URL

### 12. Rollback Plan
If production breaks:
- Identify the last known-good commit or Vercel deployment
- Revert the offending commit or restore the prior file
- Re-deploy
- Verify production again

Fix forward only when the cause is understood and the faster/safest option.

## Pull Request Checklist
For material changes, review:
- Correct files changed
- No unrelated deletions
- No secrets
- Mobile behavior
- SEO metadata
- Links
- Accessibility basics
- Analytics preserved
- Security implications

## Quality Check
Before marking the work complete:
- GitHub contains the intended final code
- Production deployment succeeded
- Live URL was tested
- Mobile was checked
- Main customer journey still works
- No secret was exposed
- SEO settings remain correct
- Critical links are functional

## Output
A verified production change with a traceable GitHub history and a functioning Vercel deployment.

## Metrics
- Deployment failure rate
- Broken-link incidents
- Rollbacks
- Production errors
- Time from approved content to verified live page
