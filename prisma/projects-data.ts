export const projectData: Array<{
  title: string;
  slug: string;
  location: string;
  description: string;
  image: string;
  images: string[];
  categorySlug: string;
}> = [
  {
    title: "Cilt Bakımı Uygulaması",
    slug: "cilt-bakimi-uygulama",
    location: "Adana",
    description:
      "Klasik ve medikal cilt bakımı uygulamalarından kareler.",
    image: "/images/projects/cilt-1.jpg",
    images: [
      "/images/projects/cilt-1.jpg",
      "/images/products/cilt-bakimi/2.jpg",
      "/images/products/cilt-bakimi/3.jpg",
    ],
    categorySlug: "cilt-bakimi",
  },
  {
    title: "Lazer Epilasyon",
    slug: "lazer-epilasyon-salon",
    location: "Adana",
    description: "Bayan ve erkek lazer epilasyon seanslarından görünüm.",
    image: "/images/projects/lazer-1.jpg",
    images: [
      "/images/projects/lazer-1.jpg",
      "/images/products/lazer-bayan/2.jpg",
      "/images/products/alex-lazer/1.jpg",
    ],
    categorySlug: "lazer-bayan",
  },
  {
    title: "Bölgesel İncelme",
    slug: "bolgesel-incelme-uygulama",
    location: "Adana",
    description: "G5, Emslim ve heykeltıraş uygulamaları.",
    image: "/images/projects/body-1.jpg",
    images: [
      "/images/projects/body-1.jpg",
      "/images/products/bolgesel-incelme/2.jpg",
    ],
    categorySlug: "bolgesel-incelme",
  },
  {
    title: "Salon Ortamı — Özal",
    slug: "salon-ortami-ozal",
    location: "Adana / Özal",
    description: "Özal şubemizden salon görünümü.",
    image: "/images/projects/salon-1.jpg",
    images: ["/images/projects/salon-1.jpg", "/images/about/about-1.jpg"],
    categorySlug: "cilt-bakimi",
  },
  {
    title: "Salon Ortamı — Gazi Paşa",
    slug: "salon-ortami-gazi-pasa",
    location: "Adana / Gazi Paşa",
    description: "Gazi Paşa şubemizden salon görünümü.",
    image: "/images/projects/salon-2.jpg",
    images: ["/images/projects/salon-2.jpg", "/images/about/about-2.jpg"],
    categorySlug: "cilt-bakimi",
  },
];
