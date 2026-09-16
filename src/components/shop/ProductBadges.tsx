interface ProductBadgesProps {
  badgeNew?: boolean;
  badgeBestseller?: boolean;
  badgeSale?: boolean;
  inStock?: boolean;
  campaignEndsAt?: string | Date | null;
}

function saleLive(campaignEndsAt?: string | Date | null): boolean {
  if (!campaignEndsAt) return false;
  return new Date(campaignEndsAt) > new Date();
}

export function ProductBadges({
  badgeNew,
  badgeBestseller,
  badgeSale,
  inStock = true,
  campaignEndsAt,
}: ProductBadgesProps) {
  const badges: { label: string; className: string }[] = [];

  if (badgeSale && saleLive(campaignEndsAt)) {
    badges.push({ label: "Kampanya", className: "bg-red-600 text-white" });
  }
  if (badgeNew) {
    badges.push({ label: "Yeni", className: "bg-orange text-black" });
  }
  if (badgeBestseller) {
    badges.push({
      label: "Çok tercih edilen",
      className: "bg-white/90 text-black",
    });
  }
  if (!inStock) {
    badges.push({
      label: "Randevuya kapalı",
      className: "bg-black/80 text-red-400 border border-red-400/50",
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
      {badges.map((b) => (
        <span
          key={b.label}
          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${b.className}`}
        >
          {b.label}
        </span>
      ))}
    </div>
  );
}
