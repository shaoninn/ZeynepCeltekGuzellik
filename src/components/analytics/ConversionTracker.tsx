"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function QuoteThanksTracker() {
  useEffect(() => {
    track("quote_request");
  }, []);
  return null;
}

export function ContactThanksTracker() {
  useEffect(() => {
    track("generate_lead");
  }, []);
  return null;
}
