/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "media-src 'self' blob: mediastream:",
      "worker-src 'self' blob:",
      "connect-src 'self' blob: data: https://www.google-analytics.com https://www.googletagmanager.com https://*.imgly.design https://staticimgly.com https://cdn.jsdelivr.net https://graph.instagram.com https://graph.facebook.com https://api.remove.bg https://*.cdninstagram.com https://*.fbcdn.net",
      "frame-src 'self' https://www.google.com https://maps.google.com https://www.instagram.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

const staticAssetCache = [
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
];

const nextConfig = {
  poweredByHeader: false,
  compress: true,
  // Hostinger: runtime /_next/image sharp often 404s / spikes CPU.
  // Serve originals + pre-baked WebP from scripts/optimize-images.mjs.
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/images/:path*",
        headers: staticAssetCache,
      },
      {
        source: "/_next/static/:path*",
        headers: staticAssetCache,
      },
      {
        source: "/favicon.ico",
        headers: staticAssetCache,
      },
      {
        source: "/icon.png",
        headers: staticAssetCache,
      },
      {
        source: "/apple-icon.png",
        headers: staticAssetCache,
      },
    ];
  },
  async redirects() {
    // Single hop: legacy apex typos / trailing host variants handled in middleware.
    return [
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.php",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
