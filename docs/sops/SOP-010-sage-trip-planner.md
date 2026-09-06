# SOP 010 — Sage Trip-Planner Experience

## Purpose
Maintain Sage as the planning layer between Health & Travels discovery content and a real Arizona family outing.

## Trigger
- A new destination is added to H&T
- An existing Sage itinerary needs improvement
- A trip-builder bug is reported
- A new family-fit field or planning feature is introduced

## Owner
Sage Product/Content Operator.

## Core Role
Health & Travels helps visitors discover.
Sage helps them decide and plan.
Arizona Hikers Association helps them stay connected.

## Required Inputs
- Destination/location
- User starting point when relevant
- Group composition and ages
- Available time
- Activity preference
- Drive tolerance
- Season/current conditions
- Shade
- Bathrooms
- Stroller/mobility considerations
- Trail difficulty
- Safety constraints

## Standard Sage Output
Whenever possible, provide:
1. Best-fit destination recommendation
2. Why it fits the group
3. Suggested timing
4. Driving/arrival guidance
5. Primary outdoor activity
6. Food option or meal planning guidance
7. Optional stay/overnight guidance
8. Safety considerations
9. Backup plan
10. Clear next action

## Family-Fit Rules
Do not reduce "family friendly" to age alone. Evaluate:
- Exposure
- Heat
- Elevation
- Terrain
- Distance
- Shade
- Bathrooms
- Water availability
- Stroller feasibility
- Attention-span burden
- Turnaround difficulty

## Current Information Rules
Time-sensitive facts such as closures, weather, permits, fire restrictions, flooding, road access, or trail conditions must be verified before being presented as current.

If current data is unavailable, state that clearly and direct the user to verify official sources before leaving.

## Safety Rules
- Never encourage users to ignore official closures or restrictions.
- Include clear turnaround logic when relevant.
- Surface monsoon, flash-flood, heat, and water hazards prominently.
- Avoid pretending a difficult hike becomes easy because a user selected "kids=yes."

## H&T Integration
Every major H&T destination guide should link to the relevant Sage experience when one exists.
Every Sage destination should link back to the best supporting H&T guide when useful.

## Email Capture
If the user has created a useful itinerary, offer a logical way to save or receive it by email when that feature is available.
Do not force email capture before providing basic planning value unless intentionally required by the product strategy.

## AHA Integration
Promote AHA when community, repeat hiking, local knowledge, trail packs, or events are a natural next step.
Do not insert membership promotion into urgent safety instructions.

## QA Checklist
Before shipping a Sage route or feature:
- Input controls work on Android and desktop.
- Build/submit button responds.
- Results render after submission.
- Links work.
- No dead-end state.
- Email/save option works if displayed.
- Safety text is readable on mobile.
- UTM tracking is present where appropriate.
- Back/forward browser behavior does not destroy the flow unexpectedly.

## Analytics
Track where possible:
- Planner starts
- Planner completions
- Destination selected
- H&T to Sage clicks
- Sage to H&T clicks
- Email itinerary requests
- AHA clicks
- Abandonment by step
- Error rate

## Success Standard
A visitor can move from "Where should we go?" to a realistic Arizona outing with fewer decisions, fewer surprises, and a clear next step.
