import rawCatalog from "@/data/catalog.json";
import type { CatalogData, CatalogProduct } from "@/types/store";

export const catalog = rawCatalog as CatalogData;
const heroPrioritySlugs = [
  "futbolka-naruto-s-vyshivkoy-itachi-chernaya-3097415624",
  "varenaya-futbolka-s-printom-satoru-godzho-3097415655",
  "futbolka-naruto-s-printom-akatsuki-chernaya-3097415665",
];
const priceAmountFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});
const priceCurrencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

export function getAllProducts() {
  return catalog.products;
}

export function getProductBySlug(slug: string) {
  return catalog.products.find((product) => product.slug === slug) ?? null;
}

export function getFeaturedProducts(count = 3) {
  return [...catalog.products]
    .sort((left, right) => {
      if ((right.discountPercent ?? 0) !== (left.discountPercent ?? 0)) {
        return (right.discountPercent ?? 0) - (left.discountPercent ?? 0);
      }

      return right.variantCount - left.variantCount;
    })
    .slice(0, count);
}

export function getHeroProducts(count = 6) {
  const prioritized = heroPrioritySlugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is CatalogProduct => Boolean(product));
  const fallback = getFeaturedProducts(catalog.products.length).filter(
    (product) => !prioritized.some((item) => item.id === product.id)
  );

  return [...prioritized, ...fallback].slice(0, count);
}

export function getRelatedProducts(product: CatalogProduct, count = 4) {
  return [...catalog.products]
    .filter((item) => item.id !== product.id)
    .sort((left, right) => {
      const leftScore =
        Number(left.kind === product.kind) +
        Number(left.badge === product.badge) +
        left.tags.filter((tag) => product.tags.includes(tag)).length;
      const rightScore =
        Number(right.kind === product.kind) +
        Number(right.badge === product.badge) +
        right.tags.filter((tag) => product.tags.includes(tag)).length;

      return rightScore - leftScore;
    })
    .slice(0, count);
}

export function formatCurrency(value: number) {
  return priceCurrencyFormatter.format(value);
}

export function formatPriceAmount(value: number) {
  return priceAmountFormatter.format(value);
}

export function formatProductCount(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}
