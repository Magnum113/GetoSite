"use client";

import Link from "next/link";
import { ShoppingBag, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { useCart } from "@/components/providers/cart-provider";
import { BrandLogo } from "@/components/store/brand-logo";

export function SiteHeader() {
  const { totalItems, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[1.5rem] border border-[#17111e]/10 bg-[rgba(255,245,235,0.76)] px-3 py-2.5 shadow-[0_14px_40px_rgba(20,14,26,0.07)] backdrop-blur-xl sm:px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <BrandLogo priority className="h-auto w-[96px] sm:w-[110px]" />
          </Link>
        </div>

        <nav className="hidden items-center gap-5 text-sm font-medium text-[#302638] md:flex">
          <Link href="/#catalog" className="transition hover:text-[#e7402a]">
            Каталог
          </Link>
          {siteConfig.telegramUrl ? (
            <Link
              href={siteConfig.telegramUrl}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-[#17111e]/10 bg-white/80 px-3.5 py-2 text-[11px] uppercase tracking-[0.2em] text-[#17111e] transition hover:border-[#29d6cf] hover:text-[#29d6cf]"
            >
              <Sparkles className="size-3.5" />
              Telegram
            </Link>
          ) : null}
        </nav>

        <button
          type="button"
          onClick={openCart}
          className="inline-flex min-w-[132px] items-center justify-center gap-2 rounded-full bg-[#17111e] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e7402a] sm:min-w-0 sm:px-4"
        >
          <ShoppingBag className="size-4 shrink-0" />
          <span className="text-[13px] uppercase tracking-[0.14em] sm:text-sm sm:tracking-[0.04em]">
            Корзина
          </span>
          <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#f4b04d] px-1.5 text-[10px] font-bold text-[#17111e]">
            {totalItems}
          </span>
        </button>
      </div>
    </header>
  );
}
