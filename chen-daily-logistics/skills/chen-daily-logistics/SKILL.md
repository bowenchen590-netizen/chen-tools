---
name: chen-daily-logistics
description: >-
  Build "Chen daily 物流" — a curated daily briefing of the most important logistics-industry
  news from the last 24 hours, drawn from authoritative international and Chinese logistics
  media, distilled into short Chinese summaries with keyword tags, and rendered as a clean
  card-based HTML page. Use this whenever the user asks for a logistics/freight/supply-chain
  news digest or daily briefing, mentions "Chen daily 物流", "物流日报", "每日物流资讯",
  "货运/海运/空运 每日新闻", wants today's shipping headlines summarized in Chinese, or asks
  to refresh / regenerate the logistics briefing — even if they don't name the skill or the
  output format explicitly.
---

# Chen daily 物流

Produce a daily logistics-industry news briefing: gather the last 24 hours of significant
news from a fixed set of authoritative sources, keep only what a logistics professional
would actually care about, write tight Chinese summaries with keyword tags, and render a
polished card-based HTML page the user can open and click through to originals.

The reader is a busy logistics professional who wants to skim 6–8 cards in two minutes and
know what moved in the industry today. Every decision below serves that: ruthless curation,
summaries that lead with the point, and a page that is calm to look at.

## Workflow

### 1. Fix the date and output path

Use today's date in the user's locale (format `YYYY-MM-DD`). The output file is:

```
chen-daily-logistics/物流日报-<YYYY-MM-DD>.html
```

relative to the current working directory. Create the `chen-daily-logistics/` folder if it
does not exist. If a file for today already exists, regenerate it (the user is asking for a
refresh).

### 2. Gather candidates

Read `references/sources.md` for the source list and how to reach each one. For each source,
look for items published in the **last 24 hours** (fall back to 48 hours only if 24h is
thin). Use `WebSearch` with time-scoped queries and `WebFetch` on section/RSS pages listed
in the reference file. Collect: headline, source name, URL, rough publish time.

`WebSearch` is US-centric and often thin on Chinese-language sources — reach those by
fetching their section pages directly with `WebFetch`.

**Expect some sources to be unreachable.** From this environment several hosts routinely
block `WebFetch` (HTTP 403, TLS errors, refused connections) — commonly The Loadstar,
Reuters, DVZ, and the Chinese sites other than 中华航运网 (`info.chineseshipping.com.cn`).
When a page won't load:
- Use the `WebSearch` result snippet as the basis for the summary and set `paywall`/limited
  accordingly, or
- Try the outlet's article via a different path (AMP page, a syndicating site like gCaptain
  or Splash247), or
- Skip that source. Do not burn many attempts on a host that has already 403'd twice.

gCaptain, FreightWaves, and 中华航运网 tend to be reliably fetchable and are good anchors.

Aim to collect 15–40 raw candidates before filtering. Cast a wide net; you will cut hard
next. If blocked sources leave you short, that is fine — see step 3.

### 3. Filter to what matters

Keep an item only if it is **substantive industry news** — something that changes how goods
move, what they cost, or who controls the flow. Good signals:

- Ocean/air freight rate or capacity moves, blank sailings, GRIs, schedule reliability
- Carrier / forwarder / 3PL M&A, alliances, major contracts, bankruptcies
- Port, canal, rail, airport operations: congestion, strikes, closures, throughput records
- Regulation, tariffs, sanctions, customs, emissions rules affecting trade lanes
- Trade-flow shifts, nearshoring, major volume swings on named lanes
- Infrastructure and technology with real operational impact (automation, new terminals,
  fuel, tracking)

Drop: vendor marketing and product launches with no operational impact, generic "supply
chain resilience" think-pieces, pure stock-price commentary, webinar/award announcements,
and stories with no logistics angle. When two sources cover the same event, keep the one
with the most concrete detail and note the event once.

Rank survivors by how much they matter to the industry today, and take the top **6–8**.
Fewer is genuinely fine — if a quiet day or blocked sources leave you with 3–5 solid items,
ship those and say so in the page's `note`. Never invent a story, a number, or a URL to
reach 6. A short honest briefing beats a padded one.

### 4. Summarize each item

For each selected item, fetch the article with `WebFetch` and produce:

- **headline_cn** — the headline in natural Chinese (not a literal word-for-word translation)
- **headline_orig** — the original headline, unchanged
- **summary_cn** — **60–120 Chinese characters**. Lead with what happened, then the number
  or the "so what". No preamble like "这篇文章讲的是". Concrete over vague. Cross-check every
  figure against the article's own wording — the fetch step sometimes garbles numbers or
  misreads the year; if a number looks off or you can't confirm it, drop the number rather
  than the article.
- **tags** — 2–4 short Chinese keyword tags for scanning. Draw from three axes: transport
  mode (海运 / 空运 / 铁路 / 公路 / 快递 / 多式联运), region or lane (中美线 / 亚欧线 /
  红海 / 美西 / 长三角 …), and theme (运价 / 运力 / 并购 / 关税 / 罢工 / 拥堵 / 政策 /
  燃油 / 数字化 / 电商物流). Reuse consistent wording so tags cluster.
- **source**, **published**, **url**. For `published`, use `YYYY-MM-DD HH:MM TZ` when the
  page exposes a real timestamp; when only the date is knowable, `YYYY-MM-DD` alone is fine —
  don't fabricate a clock time.
- **paywall** — `true` if the full text sits behind a subscription (Lloyd's List, JOC, and
  parts of The Loadstar often do). Summarize from the visible abstract / search snippet and
  set this flag; the card will show a 需订阅 marker.

**Summary example**

Input: A Loadstar article reporting Asia–North Europe spot rates fell 8% week-on-week to
~$1,450/feu as carriers reinstated capacity faster than demand recovered after Golden Week.

Good `summary_cn`: 亚洲—北欧现货运价环比下跌8%至约1450美元/FEU，主因黄金周后船司恢复运力速度快于需求回升，短期仍承压。

Weak `summary_cn`: 这篇文章讨论了亚欧航线运价的最新变化和一些市场因素。

### 5. Build the data file and render

Write the collected items to `chen-daily-logistics/news-<YYYY-MM-DD>.json` (relative to the
current working directory) following the schema in `references/schemas.md`, then render with
the bundled script. `<SKILL_DIR>` is this skill's own directory — the path shown when the
skill loads (e.g. `.claude/skills/chen-daily-logistics` for a project install, or
`~/.claude/skills/chen-daily-logistics` for a user-level install):

```bash
node "<SKILL_DIR>/scripts/build_report.mjs" \
  --data "chen-daily-logistics/news-<YYYY-MM-DD>.json" \
  --output "chen-daily-logistics/物流日报-<YYYY-MM-DD>.html" \
  --open
```

The renderer is a dependency-free Node script (works on macOS, Windows, Linux; needs only
`node` on PATH — there is no Python dependency). It fills `assets/template.html`, writes the
dated page, and opens it in the browser. Do not hand-write the HTML — the template keeps every day's page
visually consistent. If you need to restyle, edit `assets/template.html`, not the output.
If `node` is unavailable, fall back to filling `assets/template.html` yourself: replace
`{{DATE}}`, `{{COUNT}}`, `{{GENERATED_AT}}`, `{{NOTE_BLOCK}}`, and `{{CARDS}}`. (On macOS
without Node, `brew install node` fixes it.)

### 6. Report back

Tell the user the file path, how many items made the cut, and a one-line sense of the day
(e.g. "红海绕行和美线运价是今天的主线"). If the day was thin or a source was unreachable,
say which.

## Notes

- The page header reads `Chen daily 物流 · <日期>`.
- Each card is fully clickable and opens the original article in a new tab.
- The page is self-contained (no external assets) so it opens correctly as a local file.
- Keep the whole run focused: wide gather, hard filter, tight summaries. Resist the urge to
  include 12 mediocre items — the value is in the cut.
