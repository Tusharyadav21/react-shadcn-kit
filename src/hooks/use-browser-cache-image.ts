"use client";

import { useEffect, useState } from "react";
import { getCachedImage } from "../lib/browser-image-cache";

export function useBrowserCachedImage(imageUrl: string, cacheName = "app-images") {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let revokedUrl: string | null = null;
    let cancelled = false;

    async function loadImage() {
      try {
        const blob = await getCachedImage(cacheName, imageUrl);
        if (cancelled) return;

        revokedUrl = URL.createObjectURL(blob);
        setSrc(revokedUrl);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadImage();

    return () => {
      cancelled = true;
      if (revokedUrl) URL.revokeObjectURL(revokedUrl);
    };
  }, [imageUrl, cacheName]);

  return { src, loading };
}
