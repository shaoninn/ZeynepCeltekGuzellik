export default function AdminLoading() {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 p-8">
      <div
        className="h-7 w-7 border-2 border-orange border-t-transparent rounded-full animate-spin"
        aria-hidden
      />
      <p className="text-xs text-muted uppercase tracking-wider">Yükleniyor…</p>
    </div>
  );
}
