export function formatPrice(price: number, locale: string): string {
  if (locale === "bn") {
    if (price >= 10000000) {
      const crore = price / 10000000;
      return `৳${crore.toFixed(crore % 1 === 0 ? 0 : 1)} কোটি`;
    }
    if (price >= 100000) {
      const lakh = price / 100000;
      return `৳${lakh.toFixed(lakh % 1 === 0 ? 0 : 1)} লক্ষ`;
    }
    if (price >= 1000) {
      const thousand = price / 1000;
      return `৳${thousand.toFixed(thousand % 1 === 0 ? 0 : 1)} হাজার`;
    }
    return `৳${price.toLocaleString("bn-BD")}`;
  }

  return `BDT ${price.toLocaleString("en-US")}`;
}

export function formatPriceRange(
  min?: number,
  max?: number,
  locale?: string
): string {
  const l = locale || "en";
  if (min && max) return `${formatPrice(min, l)} - ${formatPrice(max, l)}`;
  if (min) return `${formatPrice(min, l)}+`;
  if (max) return `Up to ${formatPrice(max, l)}`;
  return "";
}
