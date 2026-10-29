# Original design restoration — 25 October 2026
Reference: the supplied 8ab45382-6631-4a59-a0e1-485d5acc0e84 project.

The supplied project is the visual baseline. The JSX/JavaScript, Express and HomeFeast MongoDB implementation and existing business records are retained.

## Original presentation restored
- “Ghar ka khana, every single day” hero, warm cream/orange/green palette, pill buttons and rounded cards.
- Four problem/benefit cards, four-step kitchen-to-door flow, kitchen listings, dark green savings calculator, and cook onboarding section in the source sequence.
- Original Manrope body and Fraunces display font families, served locally. Display faces are optimized to the bold/italic weights used here, with license files included.
- Source hero scroll transforms: 0–120° rotation, 0–45° depth tilt, scale 1–0.7, and text parallax up to 150px.
- Floating badge movement of 10px with 3/4/5-second timing.
- Step reveal rotation from -60° with 0.15-second stagger and scroll-driven connector.
- Pointer tilt cards using the original spring values (stiffness 200, damping 20).
- Animated savings updates, auth-card entrance, account/login/logout confirmation and reduced-motion support.
- Original inaccurate static counts/ratings are not presented as real business data.

## Requested corrections
- Query-string navigation, trailing slashes, original page aliases and direct SPA route loading remain supported.
- Body/control sizes and contrast are increased, decorative headings are capped, and text is visible before JavaScript enhancement.
- Mobile dashboards retain the working section selector and flexible cards/forms/actions.
- Auth uses the original centered card, sized to fit tested laptop viewports rather than the source minimum 85vh plus header/footer.
- Previously completed Phase 1 features remain: role dashboards, approvals, menus/availability/categories, order/subscription tracking, notifications, COD bookkeeping, reviews and complaint resolution.
- Added plan comparison, audience information and FAQ remain after the core original sections.

## Requirement coverage
See GAP_AUDIT.md for the full functional checklist and acceptance boundaries. SITE_URL is blank, email verification is disabled, and COD is the only payment method. The requested administrator account and all existing user/kitchen data are retained.

## Verification
Current machine-readable results and screenshots are in verification/. Build and API checks are included. Hosted Vercel acceptance and large-scale load testing remain pending.


Final recorded local run: 2.661s load, 2.408s LCP. 129 responsive checks, 21 route/auth-fit/motion checks, 22 content checks and the API lifecycle tests passed.
