// Small color helpers shared by the Design Agent and its evals. Zero dependencies.

export function parseHex(hex) {
  let h = String(hex || "").replace("#", "");
  if (h.length === 3) h = h.split("").map((x) => x + x).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

export function toHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}

export function luminance(hex) {
  const rgb = parseHex(hex);
  if (!rgb) return NaN;
  const [r, g, b] = rgb.map((v) => v / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Mix `hex` toward `target` by `amount` (0..1). */
export function mix(hex, target, amount) {
  const a = parseHex(hex);
  const b = parseHex(target);
  return toHex(a.map((v, i) => v + (b[i] - v) * amount));
}

/** Darken `hex` in small steps until it has `min`:1 contrast on white. Returns the original if it already passes. */
export function darkenToContrast(hex, min = 4.5) {
  let out = hex;
  for (let i = 0; i < 40 && contrast(out, "#ffffff") < min; i++) out = mix(out, "#000000", 0.06);
  return out;
}
