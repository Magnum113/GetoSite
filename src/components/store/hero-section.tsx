"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";
import { formatCurrency } from "@/lib/catalog";
import type { CatalogProduct } from "@/types/store";

type HeroSectionProps = {
  featuredProducts: CatalogProduct[];
};

const AUTO_ROTATE_MS = 4400;

function pickSecondaryProducts(products: CatalogProduct[], activeIndex: number) {
  if (products.length <= 1) {
    return [];
  }

  return Array.from({ length: Math.min(2, products.length - 1) }, (_, index) => {
    const productIndex = (activeIndex + index + 1) % products.length;
    return products[productIndex];
  });
}

export function HeroSection({ featuredProducts }: HeroSectionProps) {
  const products = featuredProducts.slice(0, 6);
  const [activeIndex, setActiveIndex] = useState(0);

  const rotateProducts = useEffectEvent(() => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % products.length);
  });

  useEffect(() => {
    if (products.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      rotateProducts();
    }, AUTO_ROTATE_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [products.length]);

  if (products.length === 0) {
    return null;
  }

  const activeProduct = products[activeIndex % products.length];
  const secondaryProducts = pickSecondaryProducts(products, activeIndex);
  const tickerItems = [...products, ...products].map((product) => product.title);

  return (
    <section className="px-4 pb-8 pt-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.03fr)_minmax(440px,0.97fr)]">
          <div className="surface-panel hero-glow relative overflow-hidden rounded-[2.7rem] px-6 py-8 sm:px-10 sm:py-10 lg:min-h-[760px] lg:px-12 lg:py-12">
            <div className="pulse-aura absolute -left-12 top-10 h-56 w-56 rounded-full bg-[#e7402a]/18 blur-3xl" />
            <div className="pulse-aura absolute bottom-10 right-0 h-60 w-60 rounded-full bg-[#29d6cf]/16 blur-3xl" />
            <div className="absolute inset-y-8 right-8 hidden w-px bg-gradient-to-b from-transparent via-[#17111e]/10 to-transparent lg:block" />

            <div className="relative flex h-full flex-col justify-between gap-12">
              <div className="space-y-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#17111e]/10 bg-white/75 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#17111e]">
                    <Sparkles className="size-3.5 text-[#e7402a]" />
                    GETO / anime streetwear
                  </span>
                  <span className="rounded-full bg-[#17111e] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-white">
                    принты, вышивка, ручной дроп
                  </span>
                </div>

                <div className="space-y-5">
                  <p className="text-xs uppercase tracking-[0.36em] text-[#6e6476]">
                    современный мерч с японским вайбом
                  </p>
                  <h1 className="display-shadow max-w-4xl font-display text-5xl uppercase leading-[0.88] text-[#17111e] sm:text-6xl lg:text-7xl xl:text-[5.7rem]">
                    Дроп, который живёт как витрина, а не как статичный баннер.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-[#564d5d] sm:text-lg">
                    Здесь крутятся реальные товары из каталога, карточки перелистываются плавно,
                    а фото не режутся по краям. Блок сразу показывает стиль бренда, ассортимент и
                    вход в каталог.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/#catalog"
                    className="inline-flex items-center gap-2 rounded-full bg-[#e7402a] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#ff684f]"
                  >
                    Смотреть каталог
                    <ArrowDownRight className="size-4" />
                  </Link>
                  <Link
                    href={`/products/${activeProduct.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#17111e]/10 bg-white/75 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#17111e] transition hover:border-[#29d6cf] hover:text-[#29d6cf]"
                  >
                    <ShoppingBag className="size-4" />
                    Открыть товар
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div
                  key={activeProduct.id}
                  className="hero-card-entrance rounded-[2rem] border border-[#17111e]/10 bg-white/70 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-[#716778]">
                    Сейчас в фокусе
                  </p>
                  <h2 className="mt-3 max-w-xl font-display text-3xl leading-tight text-[#17111e]">
                    {activeProduct.title}
                  </h2>
                  <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-3">
                    <div>
                      {activeProduct.oldPriceFrom ? (
                        <p className="text-sm text-[#8c8291] line-through">
                          {formatCurrency(activeProduct.oldPriceFrom)}
                        </p>
                      ) : null}
                      <p className="font-display text-4xl text-[#17111e]">
                        {formatCurrency(activeProduct.priceFrom)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.26em] text-[#716778]">
                        Варианты
                      </p>
                      <p className="text-sm font-semibold text-[#17111e]">
                        {activeProduct.variantCount} SKU в ротации
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {["100% хлопок", "живые карточки", "ручная вышивка"].map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.6rem] border border-[#17111e]/10 bg-white/62 px-4 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#17111e]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.7rem] border border-[#17111e]/10 bg-[#17111e] p-4 text-white shadow-[0_30px_90px_rgba(20,14,26,0.18)] sm:p-5">
            <div className="absolute left-6 right-6 top-5 z-20 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-[11px] uppercase tracking-[0.26em] text-white/75 backdrop-blur-xl">
                живой дроп
              </div>
              <div className="text-[11px] uppercase tracking-[0.26em] text-white/45">
                {String(activeIndex + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
              </div>
            </div>

            <div className="absolute left-6 right-6 top-16 z-20 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                key={activeProduct.id}
                className="hero-progress-bar h-full rounded-full bg-gradient-to-r from-[#f4b04d] via-[#e7402a] to-[#29d6cf]"
              />
            </div>

            <div className="relative min-h-[760px] overflow-hidden rounded-[2.2rem]">
              <div className="absolute -left-10 top-24 h-40 w-40 rounded-full bg-[#e7402a]/18 blur-3xl" />
              <div className="absolute right-0 top-10 h-48 w-48 rounded-full bg-[#29d6cf]/20 blur-3xl" />
              <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#f4b04d]/16 blur-3xl" />

              {products.map((product, index) => {
                const isActive = index === activeIndex;

                return (
                  <div
                    key={product.id}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                      isActive
                        ? "translate-x-0 scale-100 opacity-100"
                        : "pointer-events-none translate-x-8 scale-[1.02] opacity-0"
                    }`}
                    aria-hidden={!isActive}
                  >
                    <div className="absolute inset-x-6 top-24 bottom-[238px] rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] backdrop-blur-sm" />

                    <div className="absolute inset-x-10 top-[120px] bottom-[260px]">
                      <div className="relative h-full w-full">
                        <Image
                          src={product.gallery[0]}
                          alt={product.title}
                          fill
                          priority={index === 0}
                          sizes="(max-width: 1024px) 100vw, 46vw"
                          className="object-contain object-center drop-shadow-[0_30px_65px_rgba(0,0,0,0.35)]"
                        />
                      </div>
                    </div>

                    <div className="absolute right-6 top-28 hidden w-28 rotate-6 overflow-hidden rounded-[1.6rem] border border-white/12 bg-white/8 p-2 backdrop-blur-sm lg:block">
                      <div className="relative aspect-square">
                        <Image
                          src={product.gallery[1] ?? product.gallery[0]}
                          alt={product.title}
                          fill
                          sizes="112px"
                          className="object-contain object-center"
                        />
                      </div>
                    </div>

                    <div className="absolute inset-x-5 bottom-5 grid gap-4 lg:grid-cols-[1fr_164px]">
                      <div
                        key={`${product.id}-meta`}
                        className="hero-card-entrance rounded-[1.8rem] border border-white/12 bg-[rgba(13,10,18,0.78)] p-5 backdrop-blur-xl"
                      >
                        <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                          {product.kind}
                          {product.badge ? ` • ${product.badge}` : ""}
                        </p>
                        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                          <div>
                            <h2 className="max-w-md font-display text-3xl leading-tight text-white">
                              {product.title}
                            </h2>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {product.colors.slice(0, 3).map((color) => (
                                <span
                                  key={color}
                                  className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/78"
                                >
                                  {color}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-end gap-4">
                            <div>
                              {product.oldPriceFrom ? (
                                <p className="text-sm text-white/38 line-through">
                                  {formatCurrency(product.oldPriceFrom)}
                                </p>
                              ) : null}
                              <p className="font-display text-4xl text-[#f4b04d]">
                                {formatCurrency(product.priceFrom)}
                              </p>
                            </div>
                            <Link
                              href={`/products/${product.slug}`}
                              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#17111e] transition hover:bg-[#f4b04d]"
                            >
                              Открыть
                              <ChevronRight className="size-4" />
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="hidden rounded-[1.8rem] border border-white/12 bg-white/6 p-4 backdrop-blur-xl lg:block">
                        <p className="text-[11px] uppercase tracking-[0.26em] text-white/45">
                          Размеры
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {product.sizes.slice(0, 5).map((size) => (
                            <span
                              key={size}
                              className="rounded-full border border-white/12 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`group text-left transition duration-500 ${
                      isActive ? "translate-y-[-2px]" : ""
                    }`}
                  >
                    <div
                      className={`rounded-[1.7rem] border p-3 backdrop-blur-sm transition duration-500 ${
                        isActive
                          ? "border-white/18 bg-white/10 shadow-[0_18px_44px_rgba(0,0,0,0.22)]"
                          : "border-white/8 bg-white/[0.04] hover:border-white/16 hover:bg-white/[0.07]"
                      }`}
                    >
                      <div className="grid grid-cols-[84px_1fr_auto] items-center gap-3">
                        <div className="overflow-hidden rounded-[1.2rem] border border-white/10 bg-white/8">
                          <div className="relative aspect-square">
                            <Image
                              src={product.gallery[0]}
                              alt={product.title}
                              fill
                              sizes="84px"
                              className="object-contain object-center p-1"
                            />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-white/42">
                            {product.kind}
                            {product.badge ? ` • ${product.badge}` : ""}
                          </p>
                          <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-white">
                            {product.title}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-[#f4b04d]">
                            {formatCurrency(product.priceFrom)}
                          </p>
                        </div>

                        <ChevronRight
                          className={`size-4 transition ${
                            isActive ? "translate-x-0 text-white" : "translate-x-0 text-white/30"
                          }`}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {secondaryProducts.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {secondaryProducts.map((product) => (
                  <span
                    key={product.id}
                    className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-white/58"
                  >
                    Дальше: {product.title}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="surface-panel mt-6 overflow-hidden rounded-[2rem] py-4">
          <div className="ticker-track flex min-w-max gap-3 px-4">
            {tickerItems.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-full border border-[#17111e]/10 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#17111e]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
