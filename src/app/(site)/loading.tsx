export default function SiteLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-4">
      <div
        className="h-8 w-8 border-2 border-orange border-t-transparent rounded-full animate-spin"
        aria-hidden
      />
      <p className="text-sm text-muted tracking-wide uppercase">Yükleniyor…</p>
    </div>
  );
}
