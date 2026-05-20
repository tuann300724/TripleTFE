/** Sinh mã ID tiếp theo theo prefix (P01, C12, HD-013) */
export function nextId(items, prefix, pad = 2) {
  const nums = items
    .map((x) => x.id)
    .filter((id) => id?.startsWith(prefix))
    .map((id) => {
      const tail = id.replace(prefix, "").replace(/^-/, "");
      const n = parseInt(tail, 10);
      return Number.isNaN(n) ? 0 : n;
    });
  const max = nums.length ? Math.max(...nums) : 0;
  const next = max + 1;
  if (prefix === "HD") return `HD-${String(next).padStart(3, "0")}`;
  return `${prefix}${String(next).padStart(pad, "0")}`;
}
