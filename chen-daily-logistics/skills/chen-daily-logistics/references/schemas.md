# Data schema

`news-<YYYY-MM-DD>.json` — input to `scripts/build_report.mjs`.

```json
{
  "date": "2026-08-27",
  "note": "可选。当天概况或异常说明，会显示在页面副标题下方。例如：红海绕行与美线运价是主线；DVZ 今日无更新。",
  "items": [
    {
      "headline_cn": "亚洲—北欧现货运价环比下跌8%",
      "headline_orig": "Asia-North Europe spot rates slide 8% as capacity returns",
      "summary_cn": "亚洲—北欧现货运价环比下跌8%至约1450美元/FEU，主因黄金周后船司恢复运力速度快于需求回升，短期仍承压。",
      "tags": ["海运", "亚欧线", "运价"],
      "source": "The Loadstar",
      "published": "2026-08-27 09:15 CET",
      "url": "https://theloadstar.com/...",
      "paywall": false
    }
  ]
}
```

## Field rules

| field | required | notes |
|---|---|---|
| `date` | yes | `YYYY-MM-DD`, shown in the header as `Chen daily 物流 · <date>` |
| `note` | no | one line; omit or leave `""` if nothing to say |
| `items` | yes | 6–8 objects, already ranked most-important-first |
| `headline_cn` | yes | natural Chinese, not literal translation |
| `headline_orig` | yes | original headline verbatim; for Chinese sources, same as `headline_cn` |
| `summary_cn` | yes | 60–120 Chinese characters, leads with the point |
| `tags` | yes | 2–4 short Chinese tags |
| `source` | yes | display name, e.g. `Reuters`, `中国航务周刊` |
| `published` | yes | `YYYY-MM-DD HH:MM TZ` if a real timestamp is known; `YYYY-MM-DD` alone is acceptable — do not invent a clock time |
| `url` | yes | link to the original; the whole card links here |
| `paywall` | no | `true` → card shows a `需订阅` marker; default `false` |

The script validates that `items` is non-empty and that each item has the required fields;
it exits with a clear message if not.
