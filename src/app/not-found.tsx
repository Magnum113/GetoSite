import Link from "next/link";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="px-4 pb-8 pt-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <section className="surface-panel rounded-[2.4rem] px-6 py-16 text-center sm:px-10">
            <div className="mx-auto max-w-2xl space-y-5">
              <p className="text-xs uppercase tracking-[0.32em] text-[#706778]">404</p>
              <h1 className="font-display text-4xl text-[#17111e] sm:text-5xl">
                Товар не найден
              </h1>
              <p className="text-sm leading-7 text-[#5d5464]">
                Возможно, URL устарел или товара больше нет в текущей выгрузке каталога.
              </p>
              <Link
                href="/#catalog"
                className="inline-flex rounded-full bg-[#17111e] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#e7402a]"
              >
                Вернуться в каталог
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
