import { useEffect, useState } from "react";
import { PRODUCT_IMAGE_PLACEHOLDER, defaultProductImageUrl, resolveProductImageSrc } from "../../utils/productImage";

/**
 * Hiển thị ảnh sản phẩm — fallback placeholder khi URL lỗi hoặc thiếu.
 */
export default function ProductImage({ src, productId, alt = "", className, loading = "lazy" }) {
  const [imgSrc, setImgSrc] = useState(() => resolveProductImageSrc(src, productId));

  useEffect(() => {
    setImgSrc(resolveProductImageSrc(src, productId));
  }, [src, productId]);

  const handleError = () => {
    setImgSrc((prev) => {
      if (prev === PRODUCT_IMAGE_PLACEHOLDER) return prev;
      const seeded = productId ? defaultProductImageUrl(productId) : null;
      if (seeded && prev !== seeded) return seeded;
      return PRODUCT_IMAGE_PLACEHOLDER;
    });
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={handleError}
    />
  );
}
