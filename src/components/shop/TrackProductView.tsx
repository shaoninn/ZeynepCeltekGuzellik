"use client";

import { useEffect } from "react";
import { addRecent } from "@/lib/local-lists";

/** Records product id in localStorage — no network. */
export function TrackProductView({ productId }: { productId: string }) {
  useEffect(() => {
    addRecent(productId);
  }, [productId]);
  return null;
}
