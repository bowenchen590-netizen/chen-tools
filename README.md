# chen-tools — Claude Code 插件市场

个人插件市场,目前包含一个插件:

## chen-daily-logistics

每日物流行业资讯精选,输出卡片式可视化 HTML 页面。详见
[`chen-daily-logistics/skills/chen-daily-logistics/SKILL.md`](chen-daily-logistics/skills/chen-daily-logistics/SKILL.md)。

**依赖:** Node.js(渲染脚本用,无其他依赖)。

## 在任意机器上安装

```
/plugin marketplace add <你的GitHub用户名>/chen-tools
/plugin install chen-daily-logistics@chen-tools
```

安装后触发:`/chen-daily-logistics:chen-daily-logistics` 或直接说「生成今天的物流日报」。

## 更新

改动后 `git push`,然后在每台机器上:

```
/plugin marketplace update chen-tools
```

或在 `/plugin` 面板的 Marketplaces 标签页开启 autoUpdate,让 Claude Code 启动后自动拉取。
每次发新版记得把 `.claude-plugin/marketplace.json` 和 `chen-daily-logistics/.claude-plugin/plugin.json`
里的 `version` 一起递增,否则不会触发更新。
