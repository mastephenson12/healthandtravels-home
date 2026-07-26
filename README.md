# Health & Travels — Root Landing Page

This repository contains the lightweight static landing page for [healthandtravels.com](https://healthandtravels.com), hosted on **Vercel**.

## 🌐 Ecosystem Architecture

The `healthandtravels.com` ecosystem is split across dedicated subdomains:

* **Root Landing Page:** `https://healthandtravels.com` (This repository — Vercel)
* **Sage Web App:** `https://sage.healthandtravels.com`
* **Newsletter:** `https://newsletter.healthandtravels.com` (Beehiiv)

## 📄 File Structure

* `index.html` — Clean welcome page directing traffic to Sage and the Newsletter.
* `ads.txt` — Google AdSense verification record for domain-level ad management.

## 🚀 Deployment

Deploys automatically via **Vercel** on every push to the `main` branch.
