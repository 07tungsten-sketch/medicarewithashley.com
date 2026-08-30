# Homepage performance optimization report

Measured August 29, 2026 with Lighthouse 13.4.1. Mobile used the default performance preset; desktop used the desktop preset. The production baseline was collected from `https://medicarewithashley.com/` before the changes. The optimized build was measured through the production Node server locally because publishing is a separate user action.

## Before and after

| Metric | Production baseline mobile | Optimized local mobile* | Production baseline desktop | Optimized local desktop* |
| --- | ---: | ---: | ---: | ---: |
| Performance | 55–56 | 60–71 | 83–89 | 98–99 |
| Accessibility | 93 | 100 after contrast/semantics fixes | 93 | 100 after contrast/semantics fixes |
| Best Practices | 77 | 100 | 77 | 100 |
| SEO | 100 | 100 | 100 | 100 |
| FCP | 2.3–2.4 s | 2.1–2.3 s | 0.8 s | 0.7 s |
| LCP | 5.5–5.7 s | 2.3–3.9 s | 1.6–2.8 s | 0.8–1.1 s |
| Speed Index | 2.6–2.7 s | 2.4–2.6 s | 1.1 s | 0.7 s |
| TBT | 800–850 ms | 1,090–1,270 ms** | 20–160 ms | 0 ms |
| CLS | 0.081–0.084 | 0.084 | 0.010–0.021 | 0.026 |
| Requests | 175–176 | 31 | 182–187 | 31–32 |
| Transfer | 3.07–3.44 MB | 0.72 MB | 3.68–4.85 MB | 0.72 MB |
| Third-party requests | 144–145 | 2 | 151–156 | 2–3 |

\* Local absolute timings exclude the published edge/network path. Request counts, resource composition, and transfer reductions are representative; published scores must be reconfirmed after deployment.

\** Repeated throttled mobile runs in the shared local environment were highly variable, including incomplete runs. The stable optimized run is reported rather than treating the unstable results as production evidence. Analytics now loads on first interaction or after 15 seconds, with its inline queue preserving earlier page views and conversion events.

## Resource changes

- The LCP preload now targets Ashley's hero portrait instead of the footer logo.
- The portrait has 320, 480, and 640 pixel responsive WebP candidates (5.9 KB, 10.0 KB, and 16.2 KB).
- Font imports use Latin-only Inter and Lora assets. Measured font transfer fell 41–49%.
- The unused React Query provider and its standalone client chunk were removed.
- The GoHighLevel guide form loads only when it approaches the viewport or receives focus/click.
- YouTube is an accessible click-to-load facade using the privacy-enhanced embed.
- Lower homepage sections use `content-visibility: auto`; their prerendered HTML and text remain present.
- Below-fold images use explicit dimensions and asynchronous decoding. The carrier marquee stops under reduced-motion preferences.

## Cache and freshness diagnosis

Both the normal and cache-busted public homepage returned:

- HTTP 200
- `cache-control: private, max-age=0, must-revalidate`
- Brotli HTML
- identical HTML SHA-256 hashes

The local production server also validates canonical redirects and fresh prerendered HTML. The responses tested show no evidence of a long-lived HTML cache in the application server or published edge response; identical hashes do not prove the state of every edge location. Hashed assets remain immutable as intended. If stale HTML appears after a future release, first verify the active release identifier and content at the affected edge; do not disable immutable caching for hashed assets.

## Validation

- 823 unit tests pass.
- TypeScript passes.
- All 76 routes prerender.
- SEO validation covers 3,333 internal links and 175 JSON-LD blocks.
- Canonical redirect and Brotli/gzip/identity representation checks pass.
- At 375×812, the page has no horizontal overflow, the hero uses a responsive image candidate, both CTAs are keyboard reachable and at least 44 px high, and neither YouTube nor GoHighLevel loads before its gate.