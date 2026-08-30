# Sources for Chen daily 物流

The fixed source set. For each, the goal is items published in the **last 24 hours**. Use
the query hints with `WebSearch`, and fetch the section/RSS pages directly with `WebFetch`
when search is thin (especially for the Chinese sources).

Always prefer the primary source's own page for the final `url` on a card.

## International

### Reuters — logistics / shipping desk
- Search: `Reuters shipping freight logistics <today's date>`, `site:reuters.com container shipping`
- Sections to fetch: `https://www.reuters.com/business/` , `https://www.reuters.com/markets/commodities/`
- Free to read. Strong on macro, tariffs, carrier earnings, port disruductions.

### Journal of Commerce (JOC)
- Search: `JOC.com container shipping <topic>`, `Journal of Commerce spot rates`
- Section: `https://www.joc.com/`
- **Often paywalled.** Use the visible abstract; set `paywall: true`.

### Lloyd's List
- Search: `Lloyd's List <topic> shipping`
- Section: `https://www.lloydslist.com/`
- **Paywalled.** Headline + teaser only; set `paywall: true`.

### FreightWaves
- Search: `FreightWaves <topic>`, `site:freightwaves.com`
- Section / RSS: `https://www.freightwaves.com/news` , `https://www.freightwaves.com/news/feed`
- Free. Strong on North American trucking, rail, air cargo, freight-market data.

### The Loadstar
- Search: `The Loadstar <topic>`, `site:theloadstar.com`
- Section / RSS: `https://theloadstar.com/` , `https://theloadstar.com/feed/`
- Mostly free, some premium. Strong on ocean + air freight, forwarders, e-commerce logistics.

### DVZ / Logistik Heute (German market)
- Search: `DVZ Logistik <topic>`, `Logistik Heute <topic>`
- Sections: `https://www.dvz.de/` , `https://logistik-heute.de/`
- Some paywalled. German-language; translate headline and summary to Chinese as usual.

## China

### 中国物流与采购联合会 (CFLP)
- Section: `http://www.chinawuliu.com.cn/` (news + industry statistics, PMI releases)
- Search: `中国物流与采购联合会 <topic>`, `物流业景气指数`
- Authoritative for China logistics PMI, policy, association guidance.

### 中国航务周刊 (China Shipping Gazette)
- Section: `https://www.chineseshipping.com.cn/`
- Search: `中国航务周刊 <topic>`, `航运 港口 <today>`
- Ocean shipping, ports, Chinese carriers.

### 物流指闻
- Site: `https://www.56885.net/` / search `物流指闻 <topic>`
- Industry news aggregator: express delivery, contract logistics, funding, e-commerce supply chain.

### 运联智库 / 运联智库 (LogClub)
- Site: `https://www.yunlianzhiku.com/` / search `运联智库 <topic>`
- Analysis-heavy: trucking, LTL/FTL, express, logistics real estate, capital moves.

## Query tips

- Add recency terms: `today`, `this week`, the ISO date, or `过去24小时`.
- For rate/capacity stories, search the lane: `Asia Europe spot rate`, `transpacific capacity`,
  `air cargo rates <region>`.
- For disruptions: `port strike`, `Red Sea diversion`, `Panama Canal draft`, `港口拥堵`.
- If a source yields nothing usable in 24h, skip it silently — do not force an item in just
  to cover every source. Note unreachable sources when reporting back to the user.
