/**
 * Seed default testimonials onto every service that has none yet.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-testimonials.mjs
 */

import { createClient } from "@supabase/supabase-js";

const DEFAULTS = [
  {
    quote_text:
      "The level of service provided by NativeShine Services is second to none, and it is one of the main reasons our customers love staying here.",
    client_name: "Hotel Services Client",
    initials: "HS",
    sort_order: 0,
  },
  {
    quote_text:
      "We recently switched to NativeShine Services and needed a seamless transition. They were extremely helpful and efficient throughout the process.",
    client_name: "Floor Restoration Client",
    initials: "FR",
    sort_order: 1,
  },
];

async function main() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: services, error } = await supabase
    .from("services")
    .select("id, slug, service_testimonials(id)");
  if (error) throw error;

  for (const service of services || []) {
    const existing = service.service_testimonials || [];
    if (existing.length > 0) {
      console.log(`skip ${service.slug} (already has ${existing.length})`);
      continue;
    }
    const rows = DEFAULTS.map((t) => ({ ...t, service_id: service.id }));
    const { error: insErr } = await supabase
      .from("service_testimonials")
      .insert(rows);
    if (insErr) throw insErr;
    console.log(`seeded ${service.slug} (${rows.length} testimonials)`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
