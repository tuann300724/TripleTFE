/** Ảnh sản phẩm admin — placeholder & chuẩn hóa URL (chỉ dùng cho Products) */

const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" role="img" aria-label="Sản phẩm">
  <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#ecfdf5"/><stop offset="100%" stop-color="#e2e8f0"/>
  </linearGradient></defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <circle cx="200" cy="168" r="48" fill="none" stroke="#10b981" stroke-width="3" opacity="0.5"/>
  <path d="M152 248h96l-16 56H168l-16-56z" fill="#94a3b8" opacity="0.35"/>
  <text x="200" y="318" text-anchor="middle" fill="#64748b" font-family="system-ui,sans-serif" font-size="15" font-weight="600">TripleT</text>
</svg>`;

export const PRODUCT_IMAGE_PLACEHOLDER = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(PLACEHOLDER_SVG)}`;

/** URL mẫu ổn định theo mã SP (picsum seed cố định) */
export function defaultProductImageUrl(productId = "new") {
  const seed = encodeURIComponent(String(productId).replace(/\s+/g, "-"));
  return `https://picsum.photos/seed/triplet-${seed}/400/400`;
}

export function resolveProductImageSrc(src, productId) {
  if (typeof src === "string") {
    const trimmed = src.trim();
    if (!trimmed) {
      return productId ? defaultProductImageUrl(productId) : PRODUCT_IMAGE_PLACEHOLDER;
    }
    if (trimmed.startsWith("data:image/")) return trimmed;
    if (/images\.unsplash\.com/i.test(trimmed) && productId) {
      return defaultProductImageUrl(productId);
    }
    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")) return trimmed;
  }
  if (productId) return defaultProductImageUrl(productId);
  return PRODUCT_IMAGE_PLACEHOLDER;
}
