# Health & Travels Cloudinary photo system

Health & Travels uses a private, phone-friendly intake page plus a searchable Cloudinary catalog.

## Upload from Android or Google Photos

Open `https://healthandtravels.com/media-upload.html`, enter the private media key, choose one or more photos, and add the location, intended use, people, orientation, description, and rights confirmation.

Uploads go to `health-and-travels/inbox` for review and do not automatically appear on a public page.

## Local private inbox

Downloaded originals belong under the Git-ignored `photo-inbox` directory:

```text
photo-inbox/
  payson/
    _defaults.json
    woods-canyon-lake-family-picnic.jpg
    woods-canyon-lake-family-picnic.jpg.json
```

A destination `_defaults.json` can supply shared metadata:

```json
{
  "location": "Payson, Arizona",
  "credit": "Mark Stephenson",
  "rights": "user-owned",
  "usage": ["hero", "card", "article"],
  "tags": ["payson", "family", "outdoors"]
}
```

A sidecar named `<photo filename>.json` can add photo-specific details:

```json
{
  "alt": "Family picnicking beside Woods Canyon Lake under tall pine trees",
  "caption": "A cool-weather family stop at Woods Canyon Lake"
}
```

Preview clean names, tags, and warnings:

```sh
npm run cloudinary:inbox
```

Upload only after reviewing the preview:

```sh
npm run cloudinary:inbox -- --confirm
npm run cloudinary:catalog
```

The inbox accepts AVIF, HEIC, HEIF, JPEG, PNG, and WebP. It creates lowercase SEO-friendly public IDs and records alt text, caption, location, credit, rights, intended usage, and tags.

## Searchable catalog

Regenerate `data/cloudinary-images.json` after uploads or Cloudinary metadata edits:

```sh
npm run cloudinary:catalog
```

The catalog stores only public asset information and flags missing alt text, ownership, location, tags, intended usage, or weak public IDs. Commit the catalog with the related website change. Credentials and original inbox photos must never be committed.
