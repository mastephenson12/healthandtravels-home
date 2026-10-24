# Homepage journey simplification

The homepage now gives visitors one main route: choose an outing, review the prefilled details in Sage, then build and keep the plan.

## Behavior

- Primary hero action: **Plan My Arizona Adventure**, opening the homepage finder. A text link to Sage supports visitors who already know their destination.
- Five visible choices: starting area, family age group/adults, time available, drive limit and activity. Shade, bathrooms, step-free access and food needs are optional in one disclosure.
- Up to three ranked suggestions within the selected starting area's drive estimate. Unknown routes do not borrow Phoenix times. Fewer or no results are explicitly allowed; empty results offer guides and Sage.
- Outing links retain the specific place, origin, ages, drive limit, independent comfort selections and food needs. Sage opens with these answers filled in for review, without `plan=ready`. The current month supplies an explicitly disclosed season default. Sage maps a 2–3-hour choice to its existing half-day category.
- Shorter outings are labeled when they do not fill the selected time. Step-free access is described as unverified rather than promised.
- Newsletter, AHA, shop and future pass links remain available below the guides in an optional disclosure. Shortlist saving/email also sit behind a disclosure.
- New shortlist saves use version 2 and preserve all selected fields. Older saves without origin/age/comfort choices are not silently reinterpreted. They remain in storage until the visitor replaces or clears them.
- Existing GA4 remains installed. `sage_cta_click` fires on actual Sage links; the existing `planner_to_sage` event remains for compatibility. Food needs are no longer included in finder analytics.

## Estrella

Removed the unconditional featured-weekend promotion and the `Bathrooms: Yes` promise from its finder record. It is a short outing with a dated county-alert note and a current-alert link. The county alert checked October 24 says the playground and ramadas 7, 10 and 11 remain closed, while the turf area, one-mile path, ramadas and loop drive have reopened. Nature Center hours are restricted through November 1.

Source: https://www.maricopacountyparks.net/estrella---temporary-playground-and-ramada-closures/

This homepage change does not update Sage's older October 7 Estrella itinerary text. Refreshing that destination's data remains a separate content task.

## Validation

- `node --test scripts/*.test.cjs`: eight tests pass, including five journey regressions.
- Browser checked the homepage at a 390 × 844 override and the normal desktop size. Main CTA begins around y=458px and the header ends around y=137px; the earlier audit measured approximately y=786px and 258px respectively. These are layout observations, not conversion evidence.
- Mobile browser: empty Flagstaff/30-minute shortlist gives alternatives and hides saving; Tucson/90-minute shortlist gives one outing. Save/reload restores Tucson, teens and the chosen drive limit.
- Followed the Tucson outing link into live Sage: Boyce Thompson Arboretum, teens, full day, Tucson origin, 90-minute limit and false comfort values were prefilled, with no automatic plan generation.
- Separate browser check and URL regressions cover preschoolers, independently selected shade/bathrooms/stroller and gluten-free needs.
- No new itinerary email was sent. This change does not validate physical Android, inbox delivery, AI plan generation or conversion improvement.

Drive estimates for non-Phoenix origins reuse the existing Sage `src/utils/sage/tripOrigins.ts` table for known catalog entries. Keep those estimates aligned when destination data changes.
