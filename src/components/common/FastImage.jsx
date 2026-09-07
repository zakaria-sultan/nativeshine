import React, { useState } from "react";
import { optimizedImageUrl } from "../../lib/imageOptimize";

/**
 * Loads a compressed Supabase render URL when available; falls back to original.
 */
export default function FastImage({
  src,
  alt = "",
  className = "",
  width = 900,
  quality = 72,
  loading = "lazy",
  fetchPriority,
  ...rest
}) {
  const optimized = src ? optimizedImageUrl(src, { width, quality }) : "";
  const [current, setCurrent] = useState(optimized || src || "");

  if (!src) return null;

  return (
    <img
      src={current}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      className={className}
      onError={() => {
        if (current !== src) {
          setCurrent(src);
        }
      }}
      {...rest}
    />
  );
}
