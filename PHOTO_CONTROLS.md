# Password visibility, clickable cards and cook photos
- Login and registration include a Show password / Hide password control with an accessible label and pressed state. Toggling preserves the password and never submits the form.
- The full kitchen card is one native link, including its image, heading, description and pricing. It supports keyboard Enter, visible focus and modified-click/new-tab behavior.
- Cooks can upload up to five kitchen photos in Profile, choose a cover and remove/reorder images. Save the profile to submit changes for approval.
- Menu items support an optional dish photo with preview, replacement and removal. Save the dish to publish changes.
- Kitchen photos display on listings and profile galleries; dish photos display in public menus, cook menus and admin review.
- JPEG, PNG and WebP files up to 8 MB are accepted by the picker, resized before upload, validated/re-encoded on the server and stored as optimized WebP images in MongoDB. No external storage credentials are required.
- Original metadata is stripped. Server output is bounded to 1200px and 500 KB, with a 40-photo storage limit per cook.
- Pending/unattached photos are readable only by their owner or an administrator. Approved live kitchen/menu photos are publicly readable; disabled owners do not expose photos.
- Unsaved uploads and removed, unreferenced photos expire automatically after approximately 24 hours. Attached photos do not expire.
- No local filesystem uploads are required, so photos persist across Vercel function restarts.

Verification: four API/security tests pass, including image persistence, ownership, format validation and approval visibility. The browser suite passed 129 responsive checks plus explicit password/card/photo interaction checks; laptop/auth/motion checks passed (21).

