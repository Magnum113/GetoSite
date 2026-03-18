import Link from "next/link";
import { ArrowDownRight, ShoppingBag, Sparkles } from "lucide-react";
import { formatCurrency, formatProductCount } from "@/lib/catalog";
import type { CatalogMeta, CatalogProduct } from "@/types/store";

type HeroSectionProps = {
  meta: CatalogMeta;
  featuredProducts: CatalogProduct[];
};

export function HeroSection({ meta, featuredProducts }: HeroSectionProps) {
  const tickerItems = featuredProducts.flatMap((product) => [
    product.title,
    product.kind,
    product.badge ?? "drop",
  ]);

  return (
    <section className="px-4 pb-8 pt-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="surface-panel hero-glow relative overflow-hidden rounded-[2.6rem] px-6 py-8 sm:px-10 sm:py-10 lg:min-h-[720px] lg:px-12 lg:py-12">
          <div className="pulse-aura absolute -left-10 top-12 h-44 w-44 rounded-full bg-[#e7402a]/20 blur-3xl" />
          <div className="pulse-aura absolute bottom-10 right-0 h-52 w-52 rounded-full bg-[#29d6cf]/20 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between gap-12">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#17111e]/10 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#17111e]">
                  <Sparkles className="size-3.5 text-[#e7402a]" />
                  GETO / anime streetwear
                </span>
                <span className="rounded-full bg-[#17111e] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-white">
                  ручная вышивка + принты
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="display-shadow max-w-4xl font-display text-5xl uppercase leading-[0.88] text-[#17111e] sm:text-6xl lg:text-7xl xl:text-[5.6rem]">
                  Яркий аниме-дроп, который работает как главный кадр сезона.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[#564d5d] sm:text-lg">
                  Футболки и худи с принтами, вышивкой и реальными SKU из твоего Ozon-каталога.
                  Главная держит весь ассортимент, а checkout уже готов к подключению оплаты.
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
                  href="/checkout"
                  className="inline-flex items-center gap-2 rounded-full border border-[#17111e]/10 bg-white/70 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#17111e] transition hover:border-[#29d6cf] hover:text-[#29d6cf]"
                >
                  <ShoppingBag className="size-4" />
                  Оформить дроп
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <article className="rounded-[1.8rem] border border-[#17111e]/10 bg-white/72 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-[#706778]">Дизайны</p>
                <p className="mt-3 font-display text-4xl text-[#17111e]">
                  {formatProductCount(meta.productCount)}
                </p>
              </article>
              <article className="rounded-[1.8rem] border border-[#17111e]/10 bg-white/72 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-[#706778]">SKU из Ozon</p>
                <p className="mt-3 font-display text-4xl text-[#17111e]">
                  {formatProductCount(meta.skuCount)}
                </p>
              </article>
              <article className="rounded-[1.8rem] border border-[#17111e]/10 bg-[#17111e] p-5 text-white">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Чек без оплаты</p>
                <p className="mt-3 font-display text-3xl">готов</p>
              </article>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-rows-[1fr_auto]">
          <div className="surface-panel rounded-[2.6rem] p-4 sm:p-5">
            <div className="grid h-full gap-4 sm:grid-cols-[1.1fr_0.9fr]">
              <article className="hero-glow relative overflow-hidden rounded-[2rem] border border-[#17111e]/10 bg-[#17111e] p-4 text-white">
                <div className="float-slower absolute right-4 top-4 h-20 w-20 rounded-full bg-[#29d6cf]/30 blur-2xl" />
                <div className="float-slow absolute -bottom-2 left-4 h-24 w-24 rounded-full bg-[#e7402a]/30 blur-2xl" />
                <div className="relative space-y-4">
                  <p className="text-xs uppercase tracking-[0.32em] text-white/45">Featured motion</p>
                  <div className="grid gap-3">
                    {featuredProducts.slice(0, 2).map((product, index) => {
                      const video = product.videos[0];
                      const image = product.gallery[0];

                      return (
                        <div
                          key={product.id}
                          className={`overflow-hidden rounded-[1.6rem] border border-white/10 ${
                            index === 0 ? "aspect-[0.92]" : "aspect-[1.05]"
                          }`}
                        >
                          {video ? (
                            <video
                              autoPlay
                              muted
                              loop
                              playsInline
                              poster={image}
                              className="h-full w-full object-cover"
                            >
                              <source src={video} />
                            </video>
                          ) : (
                            <div
                              className="h-full w-full bg-cover bg-center"
                              style={{ backgroundImage: `url(${image})` }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>

              <div className="grid gap-4">
                {featuredProducts.slice(0, 3).map((product, index) => (
                  <article
                    key={product.id}
                    className={`surface-panel ${
                      index === 0 ? "bg-[#fff4ea]" : "bg-white/75"
                    } rounded-[1.8rem] p-4`}
                  >
                    <p className="text-[11px] uppercase tracking-[0.26em] text-[#7a7181]">
                      {product.kind}
                      {product.badge ? ` • ${product.badge}` : ""}
                    </p>
                    <h2 className="mt-3 font-display text-2xl leading-tight text-[#17111e]">
                      {product.title}
                    </h2>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        {product.oldPriceFrom ? (
                          <p className="text-xs text-[#8b8190] line-through">
                            {formatCurrency(product.oldPriceFrom)}
                          </p>
                        ) : null}
                        <p className="font-display text-3xl text-[#17111e]">
                          {formatCurrency(product.priceFrom)}
                        </p>
                      </div>
                      <Link
                        href={`/products/${product.slug}`}
                        className="rounded-full bg-[#17111e] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#e7402a]"
                      >
                        Открыть
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="surface-panel overflow-hidden rounded-[2rem] py-4">
            <div className="ticker-track flex min-w-max gap-3 px-4">
              {[...tickerItems, ...tickerItems].map((item, index) => (
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
      </div>
    </section>
  );
}
