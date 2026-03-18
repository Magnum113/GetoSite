"use client";

import { startTransition, useDeferredValue, useState } from "react";
import { ChevronDown, Filter, Search, SlidersHorizontal } from "lucide-react";
import type { CatalogMeta, CatalogProduct } from "@/types/store";
import { StoreProductCard } from "@/components/store/store-product-card";

type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "name";

type StorefrontShellProps = {
  products: CatalogProduct[];
  meta: CatalogMeta;
};

export function StorefrontShell({ products, meta }: StorefrontShellProps) {
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("Все");
  const [badge, setBadge] = useState("Все");
  const [color, setColor] = useState("Все");
  const [size, setSize] = useState("Все");
  const [sort, setSort] = useState<SortKey>("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const normalizedSearch = deferredSearch.trim().toLowerCase();

  const kinds = ["Все", ...new Set(products.map((product) => product.kind))];
  const badges = [
    "Все",
    ...new Set(products.map((product) => product.badge).filter((value): value is string => Boolean(value))),
  ];
  const colors = ["Все", ...new Set(products.flatMap((product) => product.colors))];
  const sizes = ["Все", ...new Set(products.flatMap((product) => product.sizes))];

  const filteredProducts = [...products]
    .filter((product) => (kind === "Все" ? true : product.kind === kind))
    .filter((product) => (badge === "Все" ? true : product.badge === badge))
    .filter((product) => (color === "Все" ? true : product.colors.includes(color)))
    .filter((product) => (size === "Все" ? true : product.sizes.includes(size)))
    .filter((product) => (inStockOnly ? product.inStock : true))
    .filter((product) => {
      if (!normalizedSearch) {
        return true;
      }

      const haystack = [
        product.title,
        product.subtitle,
        product.description,
        ...product.tags,
        ...product.colors,
        ...product.sizes,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    })
    .sort((left, right) => {
      switch (sort) {
        case "newest":
          return right.createdAt.localeCompare(left.createdAt);
        case "price-asc":
          return left.priceFrom - right.priceFrom;
        case "price-desc":
          return right.priceFrom - left.priceFrom;
        case "name":
          return left.title.localeCompare(right.title, "ru");
        case "featured":
        default:
          return (
            (right.discountPercent ?? 0) - (left.discountPercent ?? 0) ||
            right.variantCount - left.variantCount
          );
      }
    });

  return (
    <section id="catalog" className="px-4 pb-8 pt-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="surface-panel rounded-[2rem] p-5 sm:p-6 lg:sticky lg:top-28 lg:h-fit">
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-3xl text-[#17111e]">Каталог</h2>
              </div>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#706778]">
                  <Search className="size-3.5" />
                  Поиск
                </span>
                <input
                  value={search}
                  onChange={(event) =>
                    startTransition(() => {
                      setSearch(event.target.value);
                    })
                  }
                  placeholder="Naruto, Gojo, худи, вышивка..."
                  className="w-full rounded-[1.25rem] border border-[#17111e]/10 bg-white/80 px-4 py-3 text-sm outline-none transition placeholder:text-[#8d8390] focus:border-[#29d6cf]"
                />
              </label>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#706778]">
                  <Filter className="size-3.5" />
                  Категория
                </div>
                <div className="flex flex-wrap gap-2">
                  {kinds.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setKind(option)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                        kind === option
                          ? "bg-[#17111e] text-white"
                          : "border border-[#17111e]/10 bg-white/75 text-[#17111e]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#706778]">
                  <SlidersHorizontal className="size-3.5" />
                  Фильтры
                </div>

                <div className="grid gap-3">
                  <div className="relative">
                    <select
                      value={badge}
                      onChange={(event) => setBadge(event.target.value)}
                      className="w-full appearance-none rounded-[1.25rem] border border-[#17111e]/10 bg-white/80 px-4 py-3 pr-12 text-sm outline-none focus:border-[#29d6cf]"
                    >
                      {badges.map((option) => (
                        <option key={option} value={option}>
                          {option === "Все" ? "Все техники" : option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#17111e]/70" />
                  </div>
                  <div className="relative">
                    <select
                      value={color}
                      onChange={(event) => setColor(event.target.value)}
                      className="w-full appearance-none rounded-[1.25rem] border border-[#17111e]/10 bg-white/80 px-4 py-3 pr-12 text-sm outline-none focus:border-[#29d6cf]"
                    >
                      {colors.map((option) => (
                        <option key={option} value={option}>
                          {option === "Все" ? "Все цвета" : option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#17111e]/70" />
                  </div>
                  <div className="relative">
                    <select
                      value={size}
                      onChange={(event) => setSize(event.target.value)}
                      className="w-full appearance-none rounded-[1.25rem] border border-[#17111e]/10 bg-white/80 px-4 py-3 pr-12 text-sm outline-none focus:border-[#29d6cf]"
                    >
                      {sizes.map((option) => (
                        <option key={option} value={option}>
                          {option === "Все" ? "Все размеры" : option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#17111e]/70" />
                  </div>
                  <div className="relative">
                    <select
                      value={sort}
                      onChange={(event) => setSort(event.target.value as SortKey)}
                      className="w-full appearance-none rounded-[1.25rem] border border-[#17111e]/10 bg-white/80 px-4 py-3 pr-12 text-sm outline-none focus:border-[#29d6cf]"
                    >
                      <option value="featured">Сначала хиты</option>
                      <option value="newest">Сначала новинки</option>
                      <option value="price-asc">Цена: по возрастанию</option>
                      <option value="price-desc">Цена: по убыванию</option>
                      <option value="name">По названию</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#17111e]/70" />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-[1.25rem] border border-[#17111e]/10 bg-white/75 px-4 py-3 text-sm font-medium text-[#17111e]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(event) => setInStockOnly(event.target.checked)}
                  className="h-4 w-4 accent-[#17111e]"
                />
                Только в наличии
              </label>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setKind("Все");
                  setBadge("Все");
                  setColor("Все");
                  setSize("Все");
                  setSort("featured");
                  setInStockOnly(false);
                }}
                className="w-full rounded-full border border-[#17111e]/10 px-4 py-3 text-sm font-semibold text-[#17111e] transition hover:border-[#e7402a] hover:text-[#e7402a]"
              >
                Сбросить фильтры
              </button>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="surface-panel rounded-[2rem] p-5 sm:p-6">
              <div>
                <h2 className="font-display text-4xl text-[#17111e]">
                  {meta.productCount} дизайнов
                </h2>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="surface-panel rounded-[2rem] px-6 py-16 text-center">
                <h3 className="font-display text-3xl text-[#17111e]">Ничего не найдено</h3>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#5d5464]">
                  Попробуй убрать часть фильтров или изменить запрос.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <StoreProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
