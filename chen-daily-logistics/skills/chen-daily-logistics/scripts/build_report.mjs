#!/usr/bin/env node
/**
 * Render the "Chen daily 物流" HTML page from a news JSON file.
 *
 * Usage:
 *   node build_report.mjs --data news-2026-08-27.json \
 *     --output "chen-daily-logistics/物流日报-2026-08-27.html" [--open]
 *
 * The JSON schema is documented in ../references/schemas.md.
 * Dependency-free: uses only the Node standard library.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawn } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const TEMPLATE = resolve(HERE, "..", "assets", "template.html");
const REQUIRED = ["headline_cn", "headline_orig", "summary_cn", "tags", "source", "published", "url"];

function die(msg) {
  console.error(`build_report: ${msg}`);
  process.exit(1);
}

function parseArgs(argv) {
  const out = { open: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--open") out.open = true;
    else if (a === "--data") out.data = argv[++i];
    else if (a === "--output") out.output = argv[++i];
    else die(`unknown argument: ${a}`);
  }
  if (!out.data) die("missing --data");
  if (!out.output) die("missing --output");
  return out;
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderCard(item) {
  const tags = (item.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("");
  const paywall = item.paywall ? '<span class="paywall">需订阅</span>' : "";
  const orig = String(item.headline_orig || "").trim();
  const origBlock =
    orig && orig !== item.headline_cn ? `<p class="headline-orig">${esc(orig)}</p>` : "";
  return `<a class="card" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">
      <div class="card-top">
        <span class="source">${esc(item.source)}</span>
        <span class="dot">•</span>
        <span>${esc(item.published)}</span>
        ${paywall}
      </div>
      <p class="headline-cn">${esc(item.headline_cn)}</p>
      ${origBlock}
      <p class="summary">${esc(item.summary_cn)}</p>
      <div class="tags">${tags}</div>
      <div class="read">阅读原文 ↗</div>
    </a>`;
}

function openInBrowser(fileUri) {
  const platform = process.platform;
  let cmd, args;
  if (platform === "win32") {
    cmd = "cmd";
    args = ["/c", "start", "", fileUri];
  } else if (platform === "darwin") {
    cmd = "open";
    args = [fileUri];
  } else {
    cmd = "xdg-open";
    args = [fileUri];
  }
  try {
    spawn(cmd, args, { detached: true, stdio: "ignore" }).unref();
  } catch (err) {
    console.error(`(could not auto-open browser: ${err.message})`);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!existsSync(args.data)) die(`data file not found: ${args.data}`);
  if (!existsSync(TEMPLATE)) die(`template not found: ${TEMPLATE}`);

  let data;
  try {
    data = JSON.parse(readFileSync(args.data, "utf8"));
  } catch (err) {
    die(`invalid JSON in ${args.data}: ${err.message}`);
  }

  const date = String(data.date || new Date().toISOString().slice(0, 10));
  const items = data.items;
  if (!Array.isArray(items) || items.length === 0) die("'items' must be a non-empty list");

  items.forEach((item, i) => {
    const missing = REQUIRED.filter((f) => {
      const v = item[f];
      return v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
    });
    if (missing.length) die(`item ${i} is missing required field(s): ${missing.join(", ")}`);
  });

  const template = readFileSync(TEMPLATE, "utf8");
  const cards = items.map(renderCard).join("\n    ");
  const note = String(data.note || "").trim();
  const noteBlock = note ? `<div class="note">${esc(note)}</div>` : "";
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const generatedAt =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const page = template
    .replaceAll("{{DATE}}", esc(date))
    .replaceAll("{{COUNT}}", String(items.length))
    .replaceAll("{{GENERATED_AT}}", esc(generatedAt))
    .replaceAll("{{NOTE_BLOCK}}", noteBlock)
    .replaceAll("{{CARDS}}", cards);

  const outPath = resolve(args.output);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, page, "utf8");
  console.log(`wrote ${args.output}  (${items.length} items)`);

  if (args.open) openInBrowser(pathToFileURL(outPath).href);
}

main();
