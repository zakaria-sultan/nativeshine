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
