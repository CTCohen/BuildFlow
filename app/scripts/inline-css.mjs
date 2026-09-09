#!/usr/bin/env node
/**
 * Inline all CSS files into the HTML <head> so generated sites work
 * in artifact viewers and email clients without external file loads.
 */
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const distDir = process.argv[2] || "dist";
const cssFiles = new Map();

// Scan for all CSS files
function scanCSS(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      scanCSS(join(dir, entry.name));
    } else if (entry.name.endsWith(".css")) {
      const path = join(dir, entry.name);
      const content = readFileSync(path, "utf8");
      cssFiles.set(entry.name, content);
    }
  }
}

// Inline CSS into HTML
function inlineHTML(filePath) {
  let html = readFileSync(filePath, "utf8");
  let modified = false;

  for (const [fileName, css] of cssFiles) {
    const linkPattern = new RegExp(
      `<link[^>]*href="[^"]*${fileName}"[^>]*>`,
      "g"
    );
    if (linkPattern.test(html)) {
      html = html.replace(linkPattern, `<style>${css}</style>`);
      modified = true;
    }
  }

  if (modified) {
    writeFileSync(filePath, html);
    return true;
  }
  return false;
}

// Process all HTML files
function processHTML(dir) {
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      count += processHTML(join(dir, entry.name));
    } else if (entry.name.endsWith(".html")) {
      if (inlineHTML(join(dir, entry.name))) {
        count++;
      }
    }
  }
  return count;
}

scanCSS(distDir);
const inlined = processHTML(distDir);
console.log(`✓ Inlined CSS into ${inlined} HTML files`);
