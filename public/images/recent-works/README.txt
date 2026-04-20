Per-service portfolio images for “Our Recent Works” (service pages only).

Folder per route slug:
  kitchen-cleaning/
  spa-gymnasium/
  window-cleaning/
  carpet-cleaning/
  public-pedestrian-areas/
  front-of-house/
  back-of-house/
  specialist-services/

Each folder should contain up to six files:
  sample-1.png … sample-6.png

Paths in the app: /images/recent-works/{slug}/sample-N.png

To use fewer than six unique photos, edit src/data/recentWorksByService.js
(recentWorksByService) — short arrays are cycled to fill all six grid slots.
