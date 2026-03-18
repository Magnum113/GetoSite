"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ChevronRight } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { PriceText } from "@/components/store/price-text";
import type { CatalogProduct } from "@/types/store";

type HeroSectionProps = {
  featuredProducts: CatalogProduct[];
};

const AUTO_ROTATE_MS = 4400;
const HERO_TICKER_ITEMS = [
  "Наруто",
  "Итачи Учиха",
  "Сатору Годжо",
  "Магическая Битва",
  "Акатсуки",
  "GTA",
  "Мадара Учиха",
  "Gravity Defied",
];

export function HeroSection({ featuredProducts }: HeroSectionProps) {
  const products = featuredProducts.slice(0, 6);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const rotateProducts = useEffectEvent(() => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % products.length);
  });

  const showNextProduct = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % products.length);
  };

  const showPreviousProduct = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + products.length) % products.length);
  };

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
  const desktopPreviewProducts = products.slice(0, 3);
  const tickerItems = [...HERO_TICKER_ITEMS, ...HERO_TICKER_ITEMS];

  return (
    <section className="px-4 pb-8 pt-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.03fr)_minmax(440px,0.97fr)] lg:items-stretch">
          <div className="surface-panel hero-glow relative overflow-hidden rounded-[2.7rem] px-6 py-7 sm:px-10 sm:py-9 lg:h-full lg:min-h-[804px] lg:px-12 lg:py-10">
            <div className="pulse-aura absolute -left-12 top-10 h-56 w-56 rounded-full bg-[#e7402a]/18 blur-3xl" />
            <div className="pulse-aura absolute bottom-10 right-0 h-60 w-60 rounded-full bg-[#29d6cf]/16 blur-3xl" />
            <div className="absolute inset-y-8 right-8 hidden w-px bg-gradient-to-b from-transparent via-[#17111e]/10 to-transparent lg:block" />

            <div className="relative flex h-full flex-col justify-between gap-7 lg:pt-6">
              <div className="max-w-[40rem] space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#17111e] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                    принты и вышивка
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.36em] text-[#6e6476]">
                    японский вайб и яркий силуэт
                  </p>
                  <h1 className="display-shadow max-w-[11ch] font-display text-[3rem] leading-[0.92] tracking-[-0.03em] text-[#17111e] sm:text-[3.8rem] lg:text-[4rem] xl:text-[4.35rem]">
                    <span className="block">Футболки и худи</span>
                    <span className="block">с аниме принтами</span>
                    <span className="block">и вышивкой</span>
                  </h1>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/#catalog"
                    className="inline-flex items-center gap-2 rounded-full bg-[#e7402a] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#ff684f]"
                  >
                    Смотреть каталог
                    <ArrowDownRight className="size-4" />
                  </Link>
                </div>
              </div>

              <div className="hidden lg:grid lg:grid-cols-3 lg:gap-3">
                {desktopPreviewProducts.map((product, index) => {
                  const isActive = product.id === activeProduct.id;

                  return (
                    <button
                      key={`desktop-${product.id}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`group min-w-0 text-left transition duration-500 ${
                        isActive ? "translate-y-[-2px]" : ""
                      }`}
                    >
                      <div
                        className={`relative overflow-hidden rounded-[1.45rem] border backdrop-blur-sm transition duration-500 ${
                          isActive
                            ? "border-[#17111e]/18 bg-white/48 shadow-[0_18px_44px_rgba(0,0,0,0.08)]"
                            : "border-[#17111e]/10 bg-white/34 hover:border-[#17111e]/18 hover:bg-white/44"
                        }`}
                      >
                        <div className="relative aspect-[0.94]">
                          <Image
                            src={product.gallery[0]}
                            alt={product.title}
                            fill
                            sizes="220px"
                            className={`object-cover object-center transition duration-700 ${
                              isActive ? "scale-[1.02]" : "scale-100 group-hover:scale-[1.04]"
                            }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#120d18]/88 via-[#120d18]/20 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
                            <PriceText value={product.priceFrom} className="text-[1.9rem] text-[#f4b04d]" />
                            <ChevronRight
                              className={`size-3.5 transition ${
                                isActive ? "translate-x-0 text-white" : "translate-x-0 text-white/48"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.7rem] border border-[#17111e]/10 bg-[#17111e] p-3.5 text-white shadow-[0_30px_90px_rgba(20,14,26,0.18)] sm:p-5 lg:h-full lg:min-h-[804px]">
            <div className="absolute left-5 right-5 top-5 z-20 h-1 overflow-hidden rounded-full bg-white/10 sm:left-6 sm:right-6 sm:top-8">
              <div
                key={activeProduct.id}
                className="hero-progress-bar h-full rounded-full bg-gradient-to-r from-[#f4b04d] via-[#e7402a] to-[#29d6cf]"
              />
            </div>

            <div
              className="relative min-h-[650px] overflow-hidden rounded-[2.2rem] sm:min-h-[760px]"
              onTouchStart={(event) => {
                const touch = event.touches[0];
                touchStartX.current = touch.clientX;
                touchStartY.current = touch.clientY;
              }}
              onTouchEnd={(event) => {
                if (touchStartX.current === null || touchStartY.current === null) {
                  return;
                }

                const touch = event.changedTouches[0];
                const deltaX = touch.clientX - touchStartX.current;
                const deltaY = touch.clientY - touchStartY.current;

                touchStartX.current = null;
                touchStartY.current = null;

                if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) {
                  return;
                }

                if (deltaX < 0) {
                  showNextProduct();
                } else {
                  showPreviousProduct();
                }
              }}
            >
              <div className="absolute -left-10 top-20 h-40 w-40 rounded-full bg-[#e7402a]/18 blur-3xl sm:top-24" />
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
                    <div className="absolute inset-x-4 top-12 bottom-[156px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] backdrop-blur-sm sm:inset-x-6 sm:top-24 sm:bottom-[186px] sm:rounded-[2rem]">
                      <div className="relative h-full w-full">
                        <Image
                          src={product.gallery[0]}
                          alt={product.title}
                          fill
                          priority={index === 0}
                          sizes="(max-width: 1024px) 100vw, 46vw"
                          className="object-cover object-center drop-shadow-[0_30px_65px_rgba(0,0,0,0.35)]"
                        />
                      </div>
                    </div>

                    <div className="absolute right-7 top-24 hidden w-32 rotate-[7deg] overflow-hidden rounded-[1.8rem] border border-white/12 bg-white/8 shadow-[0_18px_45px_rgba(0,0,0,0.2)] backdrop-blur-sm lg:block">
                      <div className="relative aspect-[0.92] w-full">
                        <Image
                          src={product.gallery[1] ?? product.gallery[0]}
                          alt={product.title}
                          fill
                          sizes="128px"
                          className="object-cover object-center"
                        />
                      </div>
                    </div>

                    <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                      <div
                        key={`${product.id}-meta`}
                        className="hero-card-entrance rounded-[1.75rem] border border-white/12 bg-[linear-gradient(135deg,rgba(13,10,18,0.94),rgba(29,20,39,0.82))] p-4 shadow-[0_24px_60px_rgba(5,4,10,0.28)] backdrop-blur-xl sm:rounded-[2rem] sm:p-6"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                          <div className="max-w-md">
                            <h2 className="font-display text-[1.7rem] leading-[0.94] text-white sm:text-[2.7rem] sm:leading-[0.98]">
                              {product.title}
                            </h2>
                          </div>
                          <div className="flex flex-col gap-3 sm:items-end sm:gap-4">
                            <div className="sm:text-right">
                              {product.oldPriceFrom ? (
                                <PriceText value={product.oldPriceFrom} className="text-sm text-white/38 line-through" />
                              ) : null}
                              <PriceText value={product.priceFrom} className="text-[3rem] text-[#f4b04d] sm:text-5xl" />
                            </div>
                            <Link
                              href={`/products/${product.slug}`}
                              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#17111e] transition hover:bg-[#f4b04d] sm:px-5 sm:py-3 sm:text-xs"
                            >
                              Открыть
                              <ChevronRight className="size-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 lg:hidden xl:grid-cols-3">
              {products.map((product, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`group min-w-0 text-left transition duration-500 ${
                      isActive ? "translate-y-[-2px]" : ""
                    }`}
                  >
                    <div
                      className={`relative overflow-hidden rounded-[1.35rem] border backdrop-blur-sm transition duration-500 sm:rounded-[1.7rem] ${
                        isActive
                          ? "border-white/18 bg-white/10 shadow-[0_18px_44px_rgba(0,0,0,0.22)]"
                          : "border-white/8 bg-white/[0.04] hover:border-white/16 hover:bg-white/[0.07]"
                      }`}
                    >
                      <div className="relative aspect-[0.94] sm:aspect-[1.04]">
                        <Image
                          src={product.gallery[0]}
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 50vw, 220px"
                          className={`object-cover object-center transition duration-700 ${
                            isActive ? "scale-[1.02]" : "scale-100 group-hover:scale-[1.04]"
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#120d18] via-[#120d18]/28 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2.5 sm:gap-3 sm:p-4">
                          <div>
                            {product.oldPriceFrom ? (
                              <PriceText
                                value={product.oldPriceFrom}
                                className="mb-1 text-[11px] text-white/38 line-through sm:text-xs"
                              />
                            ) : null}
                            <PriceText value={product.priceFrom} className="text-2xl text-[#f4b04d] sm:text-3xl" />
                          </div>
                          <ChevronRight
                            className={`size-3.5 transition sm:size-4 ${
                              isActive ? "translate-x-0 text-white" : "translate-x-0 text-white/48"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
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
