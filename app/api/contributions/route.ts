import { NextResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 21600;

type GitHubItem = {
  number: number;
  title: string;
  state: "open" | "closed";
  pull_request?: { merged_at: string | null };
  labels: { name: string }[];
  body: string | null;
};

type Normalized = {
  number: number;
  title: string;
  state: "open" | "closed";
  merged: boolean;
  labels: string[];
  body: string;
};

async function fetchItem(owner: string, repo: string, issue: string): Promise<Normalized> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "lekhrajkumar-portfolio",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${issue}`,
    { headers, next: { revalidate: 21600 } },
  );
  if (!res.ok) throw new Error(`GitHub ${res.status}`);

  const data = (await res.json()) as GitHubItem;
  return {
    number: data.number,
    title: data.title,
    state: data.state,
    merged: data.pull_request?.merged_at != null,
    labels: data.labels.map((l) => l.name),
    body: (data.body ?? "").split("\n\n")[0].replace(/^##?\s+/, "").slice(0, 200),
  };
}

export async function POST(req: Request) {
  const { items } = (await req.json()) as {
    items: { url: string }[];
  };

  const parsed = items.map((it) => {
    const m = it.url.match(/github\.com\/([^/]+)\/([^/]+)\/(issues|pull)\/(\d+)/);
    if (!m) return null;
    return { owner: m[1], repo: m[2], issue: m[4], url: it.url };
  }).filter(Boolean) as { owner: string; repo: string; issue: string; url: string }[];

  const results = await Promise.allSettled(
    parsed.map((p) => fetchItem(p.owner, p.repo, p.issue)),
  );

  const data = results.map((r, i) => ({
    url: parsed[i].url,
    ok: r.status === "fulfilled",
    data: r.status === "fulfilled" ? r.value : null,
  }));

  return NextResponse.json(
    { generatedAt: new Date().toISOString(), items: data },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=21600, stale-while-revalidate=86400",
      },
    },
  );
}
