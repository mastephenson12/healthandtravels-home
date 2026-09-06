# SOP 008 — Photo + Cloudinary Management

## Purpose
Create a reliable first-party image workflow for Health & Travels so original Arizona photos are organized, credited, reusable, web-optimized, and easy to connect to the correct guides without turning the media library into the digital equivalent of a garage after three moves.

## Trigger
Use whenever new photos are captured, uploaded, cataloged, added to a page, or reused across Health & Travels or Sage.

## Owner
Health & Travels Media Operator.

## Inputs
- Original photo files
- Destination/location
- Date or approximate date captured
- Photographer/owner
- Rights/permission status
- Relevant Health & Travels or Sage page
- Cloudinary account/folder structure

## Core Rules
1. Prefer original first-party photos when they genuinely represent the destination.
2. Never label a photo as a trail/location photo if the image does not actually show that place.
3. Preserve rights and credit information.
4. Optimize delivery through Cloudinary rather than uploading oversized originals directly to page code.
5. Keep original source files separate from optimized delivery URLs.

## Process

### 1. Ingest New Photos
Create or use a destination-specific folder.

Recommended naming pattern:
`destination-or-area/descriptive-subject`

Examples:
- woods-canyon-lake-area/family-camping-pine-forest
- camelback-mountain/cholla-trail-entrance
- estrella-mountain-regional-park/desert-trail-view

Avoid filenames such as:
- IMG_4837
- final-final-2
- goodone

Human civilization has suffered enough from those.

### 2. Record Metadata
For each useful image, record when available:
- Destination
- Specific subject
- Photographer
- Date photographed
- Rights/permission status
- People pictured and permission status when relevant
- Orientation
- Useful page/topic associations

### 3. Rights Check
Before publishing, confirm the image is one of:
- Owned by Health & Travels / user
- Licensed for the intended use
- Used with explicit permission
- Otherwise legally reusable with required attribution

Do not assume an image found online may be reused.

### 4. Privacy Check
Before publishing photos of people:
- Avoid exposing sensitive personal information
- Avoid publishing identifying details about children unnecessarily
- Confirm appropriate permission for recognizable people when needed
- Remove metadata or framing that creates an avoidable privacy risk

### 5. Upload to Cloudinary
Upload into the correct destination folder or naming hierarchy.

Keep paths predictable so future page builders can find media without manually browsing hundreds of unrelated assets.

### 6. Use Descriptive Public IDs
Prefer readable IDs based on the scene.

Examples:
- mogollon-rim-pine-forest-panorama
- woods-canyon-lake-road-sign
- family-walking-pine-trail
- camelback-cholla-access

### 7. Deliver Optimized Variants
Use Cloudinary transformations for web delivery.

Typical transformations may include:
- `f_auto` for browser-appropriate image format
- `q_auto` for quality optimization
- width limits appropriate to the layout
- `c_fill` or other crop modes only when composition remains accurate
- responsive `srcset` where useful

Do not serve a multi-megabyte original simply because modern phones can technically suffer through it.

### 8. Match Image to Page Purpose
For destination guides prioritize:
1. Strong landscape/context image
2. Trail/attraction access
3. Family activity
4. Amenities or signs
5. Food/lodging images when original and useful

For safety pages prioritize images that clarify conditions, not merely dramatic scenery.

### 9. Write Accurate Alt Text
Alt text should describe what the image meaningfully shows.

Good:
`Family walking on a pine forest trail near Woods Canyon Lake, Arizona`

Bad:
`best family Arizona hiking Woods Canyon Lake kid friendly trail vacation`

Alt text is accessibility content, not a keyword dumping ground.

### 10. Add Image Dimensions
When practical, include width and height attributes or otherwise reserve image space to reduce layout shift.

### 11. Lazy Loading
Use lazy loading for below-the-fold images when appropriate.

Do not lazy-load the primary hero/LCP image if that harms initial rendering performance.

### 12. Maintain a Catalog
Keep the photo catalog or repository data file updated so content builders can search by:
- Destination
- Subject
- Rights status
- Photographer
- Page association

Flag missing metadata instead of silently treating unknown rights as approved.

### 13. Reuse Intelligently
An original photo may appear in multiple relevant places when it accurately represents the subject, but avoid making every page look identical.

Prefer diverse images across destination clusters when enough first-party media exists.

### 14. Sage Integration
Where Health & Travels and Sage cover the same destination:
- Reuse verified first-party images when useful
- Keep naming consistent
- Do not create conflicting location descriptions

### 15. Periodic Audit
Review the catalog periodically for:
- Missing rights information
- Broken Cloudinary URLs
- Duplicate assets
- Poor filenames
- Unused oversized originals
- Wrong location labels
- Pages lacking original photos despite available inventory

## Quality Check
Before an image is considered production-ready:
- Correct destination confirmed
- Rights status known
- Privacy reviewed
- Cloudinary delivery URL works
- File is reasonably optimized
- Crop does not misrepresent the scene
- Alt text is accurate
- Image is attached to the correct guide
- Original/source information remains recoverable

## Output
A searchable, rights-aware, optimized first-party photo library that improves trust, page quality, SEO, and brand distinctiveness across Health & Travels and Sage.

## Metrics
- Percentage of destination guides with original imagery
- Missing-rights count
- Missing-credit count
- Broken image count
- Average delivered image size
- Core Web Vitals / LCP impact
- Number of reusable destination photo sets
