import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
// Revalidate at most every 6 hours so we don't hammer GitHub.
export const revalidate = 21600;

type GithubUser = {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

type GithubRepo = {
  name: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
};

type StatsResponse = {
  generatedAt: string;
  github: {
    user: string;
    publicRepos: number;
    followers: number;
    totalStars: number;
    topLanguages: { language: string; repos: number }[];
    sinceYear: number;
    profileUrl: string;
  } | null;
  leetcode: {
    user: string;
    solved: number;
    profileUrl: string;
  };
  experience: {
    yearsAtCompany: number;
    yearsTotal: number;
  };
};

async function fetchGithub(): Promise<StatsResponse["github"]> {
  const user = siteConfig.social.githubUser;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "lekhrajkumar-portfolio",
  };
  // Optional unauthenticated calls work, but a token raises rate limits to 5K/h.
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`, {
        headers,
        next: { revalidate: 21600 },
      }),
      fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`, {
        headers,
        next: { revalidate: 21600 },
      }),
    ]);

    if (!userRes.ok || !reposRes.ok) return null;

    const userData = (await userRes.json()) as GithubUser;
    const repos = (await reposRes.json()) as GithubRepo[];

    const owned = repos.filter((r) => !r.fork);
    const totalStars = owned.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);

    const langCounts = owned.reduce<Record<string, number>>((acc, r) => {
      if (r.language) acc[r.language] = (acc[r.language] ?? 0) + 1;
      return acc;
    }, {});
    const topLanguages = Object.entries(langCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([language, repos]) => ({ language, repos }));

    return {
      user,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      totalStars,
      topLanguages,
      sinceYear: new Date(userData.created_at).getFullYear(),
      profileUrl: siteConfig.social.github,
    };
  } catch {
    return null;
  }
}

/**
 * Aggregated stats endpoint — pulls GitHub live, LeetCode live (fallback to static).
 * Cached at the edge for 6h; falls back gracefully if any API is rate-limited.
 *
 *   curl https://lekhrajkumar.dev/api/stats
 */
const LEETCODE_FALLBACK = { user: siteConfig.social.leetcodeUser, solved: 729, profileUrl: siteConfig.social.leetcode };

async function fetchLeetcode(): Promise<typeof LEETCODE_FALLBACK> {
  try {
    const query = `{
      matchedUser(username: "${siteConfig.social.leetcodeUser}") {
        submitStats { acSubmissionNum { difficulty count } }
        profile { ranking }
      }
    }`;
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 21600 },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) return LEETCODE_FALLBACK;
    const json = await res.json();
    const total = json?.data?.matchedUser?.submitStats?.acSubmissionNum?.find(
      (d: { difficulty: string }) => d.difficulty === "All"
    );
    const ranking = json?.data?.matchedUser?.profile?.ranking;
    if (!total || typeof total.count !== "number") return LEETCODE_FALLBACK;
    return {
      user: siteConfig.social.leetcodeUser,
      solved: total.count,
      profileUrl: ranking
        ? `https://leetcode.com/u/${siteConfig.social.leetcodeUser}/`
        : siteConfig.social.leetcode,
    };
  } catch {
    return LEETCODE_FALLBACK;
  }
}

export async function GET() {
  const [github, leetcode] = await Promise.all([fetchGithub(), fetchLeetcode()]);

  const startYear = 2020;
  const now = new Date();
  const yearsTotal = Math.max(1, now.getFullYear() - startYear);

  const body: StatsResponse = {
    generatedAt: now.toISOString(),
    github,
    leetcode,
    experience: {
      yearsAtCompany: 3,
      yearsTotal,
    },
  };

  return NextResponse.json(body, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=21600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
