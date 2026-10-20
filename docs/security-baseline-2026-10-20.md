# Security baseline — October 20, 2026

Status: proposed changes in an isolated branch; not merged or activated in production.

## Changes and verification
- Added CodeQL JavaScript scanning on pull requests, main pushes, and a weekly schedule. Added CI validation. Action versions are pinned to verified commit SHAs; workflow tokens have scoped permissions and checkout does not persist credentials. Hosted scans have not yet completed; they require GitHub Actions and code scanning availability.
- Dependabot checks GitHub Actions weekly; MidSizeAI also checks its website npm dependencies. Updates require review, with no automatic merge.
- Ignore rules exclude local environment files, deployment metadata, and common private-key/certificate formats. Ignore rules do not remove files already in Git history or revoke leaked credentials.
- Added global nosniff and strict-origin-when-cross-origin response-header configuration while preserving existing routes. Header activation requires deployment. No restrictive CSP or frame blocking was introduced without an integration inventory.
- Added SECURITY.md with private reporting contacts and credential-handling guidance.
- Existing three partner-export tests pass. This repository has no installed npm dependencies to audit; its package.json contains only local maintenance scripts.
- Cloudinary signing already requires a media key and exact origin; existing in-memory throttling is instance-local, not distributed. Its key and cloud credentials were not accessed or changed.

## Inspection limits
A limited scan of current tracked text files for common private-key, GitHub, AWS, Google API-key and Stripe live-secret patterns returned no matches. This is not a full secret scan, historical scan, penetration test, or proof that credentials are absent. Both repositories are public; public visibility alone does not give visitors write access.

GitHub returned an empty visible ruleset list for each repository. Reading classic main-branch protection returned 403 Resource not accessible by integration. Therefore branch protection, push protection, secret-scanning settings, account 2FA/passkeys, installed-app grants and collaborators remain unverified and unchanged. No secrets, billing, permissions, live workflows or customer messages were changed.

## Remaining priorities
1. In GitHub Settings, verify account passkeys/2FA, recovery methods and least-privilege collaborator/installed-app access.
2. Verify secret scanning and push protection, then scan history privately and rotate any confirmed credentials at their provider.
3. After checks exist and pass, require pull requests and passing checks on main; block force pushes and deletion. Choose a review policy that still permits the repository owner to work.
4. Verify Vercel production branch/environment separation and preview access. Review API bot protection and distributed rate limits before increasing lead traffic.
5. Extend review to Sage (sage-suite-hub) and national-solar-roof-estimator separately; neither was included in this two-repository patch.

## Release and rollback
Review and merge this PR, verify the preview and response headers before production promotion, and inspect the first CodeQL/CI results. Revert the patch commit to roll back files. Dependabot/CodeQL configuration becomes active on main; account-level toggles were not modified.

References: https://docs.github.com/en/code-security/getting-started/quickstart-for-securing-your-repository ; https://vercel.com/docs/project-configuration/vercel-json .
