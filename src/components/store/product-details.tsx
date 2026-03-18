"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { PriceText } from "@/components/store/price-text";
import type { CatalogProduct, CatalogVariant } from "@/types/store";

function getVariantForSelection(
  product: CatalogProduct,
  selectedColor: string | null,
  selectedSize: string | null
) {
  return (
    product.variants.find(
      (variant) =>
        (selectedColor ? variant.color === selectedColor : true) &&
        (selectedSize ? variant.size === selectedSize : true)
    ) ??
    product.variants.find((variant) => (selectedColor ? variant.color === selectedColor : true)) ??
    product.variants.find((variant) => (selectedSize ? variant.size === selectedSize : true)) ??
    product.variants[0]
  );
}

function mergeMedia(selectedVariant: CatalogVariant, product: CatalogProduct) {
  const media = [];

  if (selectedVariant.video) {
    media.push({ type: "video" as const, src: selectedVariant.video, poster: selectedVariant.primaryImage });
  }

  for (const image of [...selectedVariant.images, ...product.gallery]) {
    if (media.some((item) => item.src === image)) {
      continue;
    }

    media.push({ type: "image" as const, src: image });
  }

  return media;
}

export function ProductDetails({ product }: { product: CatalogProduct }) {
  const { addItem } = useCart();
  const initialVariant = product.variants.find((variant) => variant.inStock) ?? product.variants[0];
  const [selectedColor, setSelectedColor] = useState<string | null>(initialVariant.color);
  const [selectedSize, setSelectedSize] = useState<string | null>(initialVariant.size);
  const [activeMediaKey, setActiveMediaKey] = useState<string | null>(null);
  const selectedVariant = getVariantForSelection(product, selectedColor, selectedSize);
  const media = mergeMedia(selectedVariant, product);
  const resolvedMediaIndex = media.findIndex((item) => item.src === activeMediaKey);
  const activeMediaIndex = resolvedMediaIndex >= 0 ? resolvedMediaIndex : 0;

  return (
    <section className="px-4 pb-6 pt-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/#catalog"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#17111e]/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#17111e] transition hover:border-[#e7402a] hover:text-[#e7402a]"
        >
          <ArrowLeft className="size-4" />
          Назад в каталог
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="surface-panel rounded-[2.4rem] p-4 sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[120px_1fr]">
              <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
                {media.map((item, index) => (
                  <button
                    key={`${item.type}-${item.src}`}
                    type="button"
                    onClick={() => setActiveMediaKey(item.src)}
                    className={`relative overflow-hidden rounded-[1.2rem] border ${
                      activeMediaIndex === index
                        ? "border-[#e7402a]"
                        : "border-[#17111e]/10"
                    } h-24 w-24 shrink-0 bg-[#efe5d8]`}
                  >
                    {item.type === "video" ? (
                      <video
                        muted
                        playsInline
                        poster={item.poster}
                        className="h-full w-full object-cover"
                      >
                        <source src={item.src} />
                      </video>
                    ) : (
                      <div
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.src})` }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="order-1 overflow-hidden rounded-[2rem] border border-[#17111e]/10 bg-[#efe5d8] lg:order-2">
                {media[activeMediaIndex]?.type === "video" ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={media[activeMediaIndex].poster}
                    className="aspect-[0.95] h-full w-full object-cover"
                  >
                    <source src={media[activeMediaIndex].src} />
                  </video>
                ) : (
                  <div
                    className="aspect-[0.95] h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${media[activeMediaIndex]?.src ?? product.gallery[0]})` }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="surface-panel rounded-[2.4rem] p-6 sm:p-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="font-display text-4xl leading-tight text-[#17111e] sm:text-5xl">
                  {product.title}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[#5d5464]">
                  {product.subtitle || product.description}
                </p>
              </div>

              <div className="rounded-[1.8rem] border border-[#17111e]/10 bg-white/75 p-5">
                {selectedVariant.oldPrice ? (
                  <PriceText value={selectedVariant.oldPrice} className="text-sm text-[#8b8190] line-through" />
                ) : null}
                <div className="mt-2">
                  <PriceText value={selectedVariant.price} className="text-5xl text-[#17111e]" />
                </div>
              </div>

              {product.colors.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#706778]">Цвет</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => {
                      const hasVariant = product.variants.some(
                        (variant) => variant.color === color && variant.inStock
                      );

                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            setSelectedColor(color);
                            const fallbackSize = product.variants.find(
                              (variant) => variant.color === color && variant.inStock
                            )?.size;

                            if (fallbackSize) {
                              setSelectedSize(fallbackSize);
                            }
                          }}
                          disabled={!hasVariant}
                          className={`rounded-full px-4 py-3 text-sm font-semibold ${
                            selectedColor === color
                              ? "bg-[#17111e] text-white"
                              : "border border-[#17111e]/10 bg-white/70 text-[#17111e]"
                          } ${!hasVariant ? "cursor-not-allowed opacity-35" : ""}`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {product.sizes.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#706778]">Размер</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const hasVariant = product.variants.some(
                        (variant) =>
                          variant.size === size &&
                          (selectedColor ? variant.color === selectedColor : true) &&
                          variant.inStock
                      );

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          disabled={!hasVariant}
                          className={`rounded-full px-4 py-3 text-sm font-semibold ${
                            selectedSize === size
                              ? "bg-[#e7402a] text-white"
                              : "border border-[#17111e]/10 bg-white/70 text-[#17111e]"
                          } ${!hasVariant ? "cursor-not-allowed opacity-30" : ""}`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() =>
                  addItem({
                    productId: product.id,
                    productSlug: product.slug,
                    productTitle: product.title,
                    variantId: selectedVariant.id,
                    variantName: selectedVariant.name,
                    size: selectedVariant.size,
                    color: selectedVariant.color,
                    price: selectedVariant.price,
                    image: selectedVariant.primaryImage,
                  })
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#17111e] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#e7402a]"
              >
                <ShoppingBag className="size-4" />
                Добавить в корзину
              </button>

              <div className="space-y-3">
                <article className="rounded-[1.45rem] border border-[#17111e]/10 bg-white/75 px-4 py-3.5 sm:px-5 sm:py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#706778]">Состав</p>
                  <p className="mt-2 text-sm leading-6 text-[#17111e]">
                    {selectedVariant.composition ?? product.composition ?? "Уточняется"}
                  </p>
                </article>
                <article className="rounded-[1.6rem] border border-[#17111e]/10 bg-white/75 p-4 sm:p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#706778]">Уход</p>
                  <p className="mt-2.5 text-sm leading-7 text-[#17111e]">
                    {selectedVariant.care ?? product.care ?? "Рекомендации появятся позже"}
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <article className="surface-panel rounded-[2.2rem] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.32em] text-[#706778]">Описание</p>
            <p className="mt-4 text-sm leading-8 text-[#342c3d]">{product.description}</p>

            {product.sizeGuide ? (
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.32em] text-[#706778]">
                  {product.sizeGuide.title}
                </p>
                <div className="mt-4 overflow-hidden rounded-[1.8rem] border border-[#17111e]/10">
                  <table className="min-w-full divide-y divide-[#17111e]/10 text-sm">
                    <tbody>
                      {product.sizeGuide.rows.map((row) => (
                        <tr key={row.join("-")} className="bg-white/70">
                          {row.map((cell, index) => (
                            <td
                              key={`${cell}-${index}`}
                              className={`px-4 py-3 ${
                                index === 0 ? "font-semibold text-[#17111e]" : "text-[#5d5464]"
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </article>

          <aside className="space-y-4">
            <article className="surface-panel rounded-[2rem] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#706778]">Теги</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.slice(0, 8).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#17111e] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
            <article className="surface-panel rounded-[2rem] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#706778]">Заказ</p>
              <p className="mt-4 text-sm leading-6 text-[#342c3d]">
                После оформления мы свяжемся с тобой и подтвердим детали заказа.
              </p>
            </article>
          </aside>
        </div>
      </div>
    </section>
  );
}
