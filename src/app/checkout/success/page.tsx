import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { siteConfig } from "@/lib/site";

type SuccessPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderId = params.order ?? "GETO-PENDING";

  return (
    <>
      <SiteHeader />
      <main className="px-4 pb-8 pt-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <section className="surface-panel rounded-[2.6rem] px-6 py-16 text-center sm:px-10">
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#17111e] text-white">
                <CheckCircle2 className="size-10 text-[#29d6cf]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#706778]">Order saved</p>
                <h1 className="mt-3 font-display text-4xl text-[#17111e] sm:text-5xl">
                  Заказ принят в работу
                </h1>
                <p className="mt-4 text-sm leading-7 text-[#5d5464]">
                  Мы сохранили состав заказа и контактные данные. Следующий шаг для проекта:
                  подключить оплату и канал уведомлений.
                </p>
              </div>
              <div className="rounded-[1.8rem] border border-[#17111e]/10 bg-white/75 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[#706778]">Номер заказа</p>
                <p className="mt-2 font-display text-3xl text-[#17111e]">{orderId}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/"
                  className="rounded-full bg-[#17111e] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#e7402a]"
                >
                  Вернуться на главную
                </Link>
                {siteConfig.telegramUrl ? (
                  <Link
                    href={siteConfig.telegramUrl}
                    target="_blank"
                    className="rounded-full border border-[#17111e]/10 bg-white/80 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#17111e] transition hover:border-[#29d6cf] hover:text-[#29d6cf]"
                  >
                    Написать в Telegram
                  </Link>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
