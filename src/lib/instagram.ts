import { memoryCache } from "@/lib/memory-cache";
import { prisma } from "@/lib/db";
import { INSTAGRAM } from "@/lib/constants";

export type InstagramPost = {
  id: string;
  permalink: string;
  mediaUrl: string;
  caption: string | null;
  mediaType: string;
};

async function readIgCredentials(): Promise<{
  token: string | null;
  userId: string | null;
  profileUrl: string;
}> {
  const rows = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: ["instagram_access_token", "instagram_user_id", "instagram"],
      },
    },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    token:
      map.instagram_access_token?.trim() ||
      process.env.INSTAGRAM_ACCESS_TOKEN?.trim() ||
      null,
    userId:
      map.instagram_user_id?.trim() ||
      process.env.INSTAGRAM_USER_ID?.trim() ||
      null,
    profileUrl: map.instagram?.trim() || INSTAGRAM,
  };
}

async function fetchFromGraph(
  token: string,
  userId: string | null
): Promise<InstagramPost[]> {
  const fields =
    "id,caption,media_url,permalink,thumbnail_url,media_type,timestamp";
  const base = userId
    ? `https://graph.facebook.com/v21.0/${encodeURIComponent(userId)}/media`
    : `https://graph.instagram.com/me/media`;

  const url = new URL(base);
  url.searchParams.set("fields", fields);
  url.searchParams.set("limit", "6");
  url.searchParams.set("access_token", token);

  const res = await fetch(url.toString(), {
    next: { revalidate: 1800 },
    signal: AbortSignal.timeout(2_500),
  });

  if (!res.ok) {
    console.error("[instagram]", res.status, await res.text());
    return [];
  }

  const data = (await res.json()) as {
    data?: Array<{
      id: string;
      caption?: string;
      media_url?: string;
      thumbnail_url?: string;
      permalink: string;
      media_type?: string;
    }>;
  };

  return (data.data || [])
    .map((item) => {
      const mediaUrl =
        item.media_type === "VIDEO"
          ? item.thumbnail_url || item.media_url
          : item.media_url || item.thumbnail_url;
      if (!mediaUrl) return null;
      return {
        id: item.id,
        permalink: item.permalink,
        mediaUrl,
        caption: item.caption || null,
        mediaType: item.media_type || "IMAGE",
      } satisfies InstagramPost;
    })
    .filter((p): p is InstagramPost => Boolean(p))
    .slice(0, 6);
}

export async function getInstagramFeed(): Promise<{
  posts: InstagramPost[];
  profileUrl: string;
  live: boolean;
}> {
  return memoryCache(
    "instagram:feed:v1",
    async () => {
      const creds = await readIgCredentials();
      if (!creds.token) {
        return { posts: [], profileUrl: creds.profileUrl, live: false };
      }
      try {
        const posts = await fetchFromGraph(creds.token, creds.userId);
        return {
          posts,
          profileUrl: creds.profileUrl,
          live: posts.length > 0,
        };
      } catch (error) {
        console.error("[instagram] feed failed:", error);
        return { posts: [], profileUrl: creds.profileUrl, live: false };
      }
    },
    { ttlMs: 30 * 60_000, skipEmpty: false }
  );
}
