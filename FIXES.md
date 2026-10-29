# Interface corrections
- Fixed the route parser: query strings no longer become page paths. “Become a cook” opens the cook registration form instead of Page not found. Changing auth mode on the same path refreshes the form correctly.
- Added handling for trailing slashes and original /orders, /cook, /admin, /login and /register links.
- Preserved the supplied Manrope/Fraunces type families with heavier headings, darker body copy and larger readable controls. Reduced oversized landing headings and plate sizing.
- Reworked auth pages into a compact laptop layout. Both login and signup fit at 1280×720, 1366×768, 1024×768 and 1440×900 without document scrolling.
- Replaced the mobile dashboard tab strip with a labeled native section selector. Cards, long text, menus, profile forms and action buttons adapt to narrow widths.
- Restored prominent continuous plate movement, 3D pointer tilt, scroll-driven rotation, a rotating ring, floating badges, section reveals, page transitions and animated auth feedback. Reduced-motion preference remains respected.
- Content is visible by default; scroll-reveal effects no longer depend on hidden content becoming visible.
- Production build, 117 responsive checks, 21 targeted routing/layout/motion checks, and the production auth/navigation smoke test pass.
- Final local production performance test: 2.661s load and 2.408s largest contentful paint at 375px, 4× CPU slowdown, 1.6Mbps download and 150ms latency. Hosted results still require validation after deployment.

The running preview is http://127.0.0.1:3001/. Reload the tab to use the rebuilt interface. The source archive has been updated.


See ORIGINAL_DESIGN.md for the supplied-design restoration completed on 25 October 2026.
