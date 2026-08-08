import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { isVideoUrl } from "@/lib/media";
import { siteConfig } from "@/config/site";
import { AgeGate } from "@/components/AgeGate";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => {
    const links: Array<Record<string, string>> = [];
    const first = siteConfig.media[0] || siteConfig.logoUrl;
    if (first) {
      try {
        links.push({ rel: "preconnect", href: new URL(first).origin, crossOrigin: "" });
      } catch {}
    }
    if (siteConfig.logoUrl) {
      links.push({ rel: "preload", as: "image", href: siteConfig.logoUrl, fetchPriority: "high" });
    }
    siteConfig.media.slice(0, 4).forEach((url) => {
      if (isVideoUrl(url)) return;
      links.push({ rel: "preload", as: "image", href: url, fetchPriority: "high" });
    });

    return {
      meta: [
        { title: siteConfig.pageTitle },
        { name: "description", content: siteConfig.pageDescription },
        { property: "og:title", content: siteConfig.pageTitle },
        { property: "og:description", content: siteConfig.pageDescription },
      ],
      links,
    };
  },
});

function Media({ url, eager }: { url: string; eager: boolean }) {
  if (isVideoUrl(url)) {
    return (
      <video
        src={url}
        className="block h-56 w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload={eager ? "auto" : "metadata"}
      />
    );
  }
  return (
    <img
      src={url}
      alt=""
      width={400}
      height={500}
      className="block h-56 w-full object-cover"
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : "auto"}
    />
  );
}

function Landing() {
  const apkUrl = siteConfig.downloadUrl;
  const images = siteConfig.shuffleMedia ? shuffle(siteConfig.media) : siteConfig.media;

  // Split into two columns, duplicate each for seamless loop
  const colA = images.filter((_, i) => i % 2 === 0);
  const colB = images.filter((_, i) => i % 2 === 1);
  const loopA = colA.length ? [...colA, ...colA] : [];
  const loopB = colB.length ? [...colB, ...colB] : [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <AgeGate />
      {/* ambient gradient */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, oklch(0.75 0.22 320 / 0.25), transparent), radial-gradient(60% 60% at 50% 100%, oklch(0.78 0.2 200 / 0.2), transparent)",
        }}
      />

      {/* Two scrolling columns */}
      <div className="relative h-screen w-full overflow-hidden pb-44">
        {images.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            还没有媒体链接，请在 src/config/site.ts 中添加。
          </div>
        ) : (
          <div className="grid grid-cols-2">
            <div className="animate-scroll-up flex flex-col will-change-transform [backface-visibility:hidden] [transform:translate3d(0,0,0)]">
              {loopA.map((url, i) => (
                <Media key={`a-${i}`} url={url} eager={i < 2} />
              ))}
            </div>
            <div
              className="animate-scroll-up flex flex-col will-change-transform [backface-visibility:hidden] [transform:translate3d(0,0,0)]"
              style={{ marginTop: "-3.5rem" }}
            >
              {loopB.map((url, i) => (
                <Media key={`b-${i}`} url={url} eager={i < 2} />
              ))}
            </div>

          </div>
        )}

      </div>

      {/* Top app identity */}
      <div className="fixed inset-x-0 top-0 z-20 flex flex-col items-center gap-2 px-6 pt-6">
        {siteConfig.logoUrl ? (
          <img
            src={siteConfig.logoUrl}
            alt={siteConfig.appName}
            className="animate-float-icon h-32 w-32 rounded-3xl border border-border object-cover shadow-2xl"
          />
        ) : (
          <div className="animate-float-icon flex h-32 w-32 items-center justify-center rounded-3xl border border-border bg-card text-5xl">
            📱
          </div>
        )}
        {siteConfig.appName && (
          <div className="text-base font-semibold text-white drop-shadow">
            {siteConfig.appName}
          </div>
        )}
        {siteConfig.tagline && (
          <p className="max-w-xs text-center text-sm text-white/80 drop-shadow">
            {siteConfig.tagline}
          </p>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex flex-col items-center px-6 pb-16">
        <a
          id="downloadBtn"
          href={apkUrl}
          rel="noopener"
          className="shine animate-pulse-glow relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border-4 border-white px-10 py-4 text-base font-semibold text-white"
          style={{ background: "var(--gradient-button)" }}
          onClick={() => {
            (window as any).fbq?.("track", "Lead", { content_name: siteConfig.appName });
          }}
        >
          <Download className="h-5 w-5" />
          <span className="relative z-10">{siteConfig.downloadLabel}</span>
        </a>
      </div>

    </main>
  );
}
