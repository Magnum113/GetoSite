import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { BrandLogo } from "@/components/store/brand-logo";

export function SiteFooter() {
  return (
    <footer className="px-4 pb-8 pt-16 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-[2rem] border border-[#17111e]/10 bg-[rgba(255,245,235,0.72)] px-6 py-8 backdrop-blur-xl sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl space-y-3">
          <BrandLogo className="h-auto w-[130px] sm:w-[150px]" />
          <p className="text-sm leading-6 text-[#5f5666]">
            {siteConfig.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-[#17111e]">
          <Link href="/" className="rounded-full border border-[#17111e]/10 px-4 py-2 transition hover:border-[#e7402a] hover:text-[#e7402a]">
            Главная
          </Link>
          <Link href="/#catalog" className="rounded-full border border-[#17111e]/10 px-4 py-2 transition hover:border-[#e7402a] hover:text-[#e7402a]">
            Каталог
          </Link>
          <Link href="/checkout" className="rounded-full border border-[#17111e]/10 px-4 py-2 transition hover:border-[#e7402a] hover:text-[#e7402a]">
            Оформление
          </Link>
        </div>
      </div>
    </footer>
  );
}
