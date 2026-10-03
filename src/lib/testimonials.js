/**
 * Default testimonials used when a service has none in Supabase yet.
 * Matches the original static ServicePageTemplate content.
 */
export const DEFAULT_TESTIMONIALS = [
  {
    text: "The level of service provided by NativeShine Services is second to none, and it is one of the main reasons our customers love staying here.",
    client: "Hotel Services Client",
    initials: "HS",
  },
  {
    text: "We recently switched to NativeShine Services and needed a seamless transition. They were extremely helpful and efficient throughout the process.",
    client: "Floor Restoration Client",
    initials: "FR",
  },
];

export function initialsFromName(name = "") {
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "NS";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function mapTestimonialRow(row) {
  return {
    id: row.id,
    text: row.quote_text || "",
    client: row.client_name || "",
    initials: row.initials || initialsFromName(row.client_name),
    sort_order: row.sort_order ?? 0,
  };
}
