"use client";

import Link from "next/link";
import { ShoppingBag, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { useCart } from "@/components/providers/cart-provider";
import { BrandLogo } from "@/components/store/brand-logo";

export function SiteHeader() {
  const { totalItems, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[1.8rem] border border-[#17111e]/10 bg-[rgba(255,245,235,0.7)] px-4 py-3 shadow-[0_20px_60px_rgba(20,14,26,0.08)] backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div>
              <BrandLogo priority className="h-auto w-[108px] sm:w-[124px]" />
              <p className="text-xs uppercase tracking-[0.35em] text-[#6e6473]">
                anime streetwear
              </p>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-[#302638] md:flex">
          <Link href="/#catalog" className="transition hover:text-[#e7402a]">
            Каталог
          </Link>
          <Link href="/checkout" className="transition hover:text-[#e7402a]">
            Checkout
          </Link>
          {siteConfig.telegramUrl ? (
            <Link
              href={siteConfig.telegramUrl}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-[#17111e]/10 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#17111e] transition hover:border-[#29d6cf] hover:text-[#29d6cf]"
            >
              <Sparkles className="size-3.5" />
              Telegram
            </Link>
          ) : null}
        </nav>

        <button
          type="button"
          onClick={openCart}
          className="inline-flex items-center gap-3 rounded-full bg-[#17111e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e7402a]"
        >
          <span className="relative inline-flex">
            <ShoppingBag className="size-4" />
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f4b04d] px-1 text-[10px] font-bold text-[#17111e]">
              {totalItems}
            </span>
          </span>
          <span className="hidden sm:inline">Корзина</span>
        </button>
      </div>
    </header>
  );
}
