# Security

Report a suspected vulnerability privately to mark@midsizeai.com. For Health & Travels, use helpme@healthandtravels.com. Include the affected URL or file and a minimal reproduction; do not send passwords, API tokens, or customer information. Do not publish working exploits in public issues.

Store credentials only in deployment environment variables or local ignored environment files. Environment variable examples must contain placeholders. A committed secret must be revoked and replaced; deleting a file or adding an ignore rule does not revoke it or erase Git history.

Security changes are reviewed through pull requests. The included workflows use pinned action commits and scoped permissions. Dependabot proposes updates; it does not merge them automatically. CodeQL runs on supported JavaScript code; a clean scan is not a guarantee of security.

Account controls must also be checked in GitHub: passkeys/two-factor authentication, collaborator and installed-app access, secret scanning/push protection, and branch protection requiring pull requests and passing checks. The connected integration cannot verify or change all of these settings. Never paste account recovery codes into repository files.
