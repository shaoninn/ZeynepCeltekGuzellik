import Image from "next/image";
import { Camera } from "lucide-react";
import type { InstagramPost } from "@/lib/instagram";

interface InstagramStripProps {
  instagramUrl: string;
  posts?: InstagramPost[];
  live?: boolean;
}

const TILES = 6;

export function InstagramStrip({
  instagramUrl,
  posts = [],
  live = false,
}: InstagramStripProps) {
  const hasLive = live && posts.length > 0;

  return (
    <section className="py-12 lg:py-16 border-y border-border bg-surface/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              @zeynepceltekguzellik
            </h2>
            {hasLive ? (
              <p className="text-xs text-orange mt-1">Canlı Instagram feed</p>
            ) : (
              <p className="text-xs text-muted mt-1 break-anywhere">
                Canlı feed için Admin → Ayarlar’da Instagram token ekleyin
              </p>
            )}
          </div>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-orange hover:underline shrink-0 self-start sm:self-auto"
          >
            Instagram’da aç
          </a>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {hasLive
            ? posts.slice(0, TILES).map((post) => (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:border-orange/50 transition-colors bg-black"
                >
                  <Image
                    src={post.mediaUrl}
                    alt={post.caption?.slice(0, 80) || "Instagram"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width:640px) 33vw, 160px"
                    unoptimized
                  />
                </a>
              ))
            : Array.from({ length: TILES }).map((_, i) => (
                <a
                  key={i}
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-orange/20 via-black to-orange/10 border border-border hover:border-orange/50 transition-colors"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2 text-center">
                    <Camera
                      size={20}
                      className="text-orange/70 group-hover:text-orange transition-colors"
                    />
                    <span className="text-[10px] text-muted group-hover:text-white transition-colors leading-tight">
                      Keşfet
                    </span>
                  </div>
                </a>
              ))}
        </div>
      </div>
    </section>
  );
}
