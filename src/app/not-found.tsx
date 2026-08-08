import { SiteLink } from "@/components/ui/SiteLink";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-display text-6xl font-bold text-orange mb-4">404</p>
        <h1 className="font-display text-2xl font-bold text-white mb-3">
          Sayfa bulunamadı
        </h1>
        <p className="text-muted text-sm mb-8">
          Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button href="/">Ana Sayfa</Button>
          <Button href="/iletisim" variant="outline">
            İletişim
          </Button>
          <SiteLink href="/projeler" className="text-sm text-orange self-center hover:underline">
            Projeler
          </SiteLink>
        </div>
      </div>
    </section>
  );
}
