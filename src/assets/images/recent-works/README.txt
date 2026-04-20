Source-of-truth files for “Our Recent Works” live in the public folder (Vite static assets):

  public/images/recent-works/<service-slug>/sample-1.png … sample-6.png

They are requested in the browser as:

  /images/recent-works/<service-slug>/sample-N.png

Logic: src/data/recentWorksByService.js
UI: src/components/services/RecentWorks.jsx
