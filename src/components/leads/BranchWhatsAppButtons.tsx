import { BRANCH_OPTIONS, branchWhatsAppUrl } from "@/lib/constants";

export function BranchWhatsAppButtons({
  prefill,
  className = "",
}: {
  prefill: string;
  className?: string;
}) {
  const text = encodeURIComponent(prefill);
  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      {BRANCH_OPTIONS.filter((b) => b.id !== "any").map((b) => (
        <a
          key={b.id}
          href={`${branchWhatsAppUrl(b.id)}?text=${text}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline justify-center min-h-11 flex-1 text-sm"
        >
          WhatsApp {b.name.replace(" Şube", "")}
        </a>
      ))}
    </div>
  );
}
