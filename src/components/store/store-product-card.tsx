"use client";

import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { PriceText } from "@/components/store/price-text";
import { useCart } from "@/components/providers/cart-provider";
import type { CatalogProduct } from "@/types/store";

export function StoreProductCard({ product }: { product: CatalogProduct }) {
  const { addItem } = useCart();
  const singleVariant = product.variants.length === 1 ? product.variants[0] : null;

  return (
    <article className="group surface-panel relative overflow-hidden rounded-[1.55rem] sm:rounded-[2rem]">
      <div className="hero-glow absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative p-3 sm:p-5">
        <div
          className="relative overflow-hidden rounded-[1.25rem] border border-[#17111e]/8 bg-[#efe5d8] sm:rounded-[1.7rem]"
          style={{ aspectRatio: "4 / 4.45" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.04]"
            style={{ backgroundImage: `url(${product.gallery[0]})` }}
          />
          {!product.inStock ? (
            <div className="absolute inset-0 grid place-items-center bg-[#17111e]/55">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white">
                Нет в наличии
              </span>
            </div>
          ) : null}
        </div>

        <div className="relative mt-3.5 sm:mt-5">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div>
              <h3 className="line-clamp-3 font-display text-[1.05rem] leading-[1.02] text-[#17111e] sm:text-2xl sm:leading-tight">
                {product.title}
              </h3>
            </div>
            <Link
              href={`/products/${product.slug}`}
              className="rounded-full border border-[#17111e]/10 bg-white/70 p-2.5 text-[#17111e] transition group-hover:border-[#e7402a] group-hover:text-[#e7402a] sm:p-3"
            >
              <ArrowUpRight className="size-3.5 sm:size-4" />
            </Link>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
            {product.sizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="rounded-full bg-[#17111e]/6 px-2.5 py-1 text-[10px] font-semibold text-[#17111e] sm:px-3 sm:text-xs"
              >
                {size}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-end justify-between gap-2 sm:mt-5 sm:gap-4">
            <div>
              {product.oldPriceFrom ? (
                <PriceText value={product.oldPriceFrom} className="text-[12px] text-[#807688] line-through sm:text-sm" />
              ) : null}
              <PriceText value={product.priceFrom} className="text-[2.05rem] text-[#17111e] sm:text-3xl" />
            </div>

            {singleVariant && product.inStock ? (
              <button
                type="button"
                onClick={() =>
                  addItem({
                    productId: product.id,
                    productSlug: product.slug,
                    productTitle: product.title,
                    variantId: singleVariant.id,
                    variantName: singleVariant.name,
                    size: singleVariant.size,
                    color: singleVariant.color,
                    price: singleVariant.price,
                    image: singleVariant.primaryImage,
                  })
                }
                aria-label="Добавить в корзину"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#17111e] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#e7402a] max-[430px]:size-11 max-[430px]:justify-center max-[430px]:gap-0 max-[430px]:px-0 max-[430px]:py-0 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm"
              >
                <ShoppingBag className="size-3.5 sm:size-4" />
                <span className="max-[430px]:hidden">В корзину</span>
              </button>
            ) : (
              <Link
                href={`/products/${product.slug}`}
                aria-label="Выбрать товар"
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#e7402a] px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#ff684f] max-[430px]:size-11 max-[430px]:px-0 max-[430px]:py-0 sm:px-5 sm:text-sm"
              >
                <ShoppingBag className="hidden size-4 max-[430px]:block" />
                <span className="max-[430px]:hidden">Выбрать</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
