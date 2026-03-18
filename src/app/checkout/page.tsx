"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoaderCircle, ShoppingBag } from "lucide-react";
import { PriceText } from "@/components/store/price-text";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { useCart } from "@/components/providers/cart-provider";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    telegram: "",
    whatsapp: "",
    city: "",
    address: "",
    notes: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          subtotal,
          customer: form,
        }),
      });

      const payload = (await response.json()) as { orderId?: string; error?: string };

      if (!response.ok || !payload.orderId) {
        throw new Error(payload.error ?? "Не удалось оформить заказ");
      }

      clearCart();
      router.push(`/checkout/success?order=${payload.orderId}`);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Не удалось оформить заказ"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="px-4 pb-8 pt-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {items.length === 0 ? (
            <section className="surface-panel rounded-[2.4rem] px-6 py-16 text-center sm:px-10">
              <div className="mx-auto max-w-xl space-y-5">
                <p className="text-xs uppercase tracking-[0.32em] text-[#706778]">Корзина</p>
                <h1 className="font-display text-4xl text-[#17111e] sm:text-5xl">
                  Корзина пустая
                </h1>
                <p className="text-sm leading-7 text-[#5d5464]">
                  Сначала добавь в корзину футболку или худи, а потом переходи к оформлению.
                </p>
                <Link
                  href="/#catalog"
                  className="inline-flex items-center gap-2 rounded-full bg-[#17111e] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#e7402a]"
                >
                  <ShoppingBag className="size-4" />
                  Вернуться в каталог
                </Link>
              </div>
            </section>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <section className="surface-panel rounded-[2.4rem] p-6 sm:p-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-[#706778]">Оформление</p>
                    <h1 className="mt-3 font-display text-4xl text-[#17111e] sm:text-5xl">
                      Оформление заказа
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5d5464]">
                      Оставь контакты и адрес, а мы подтвердим заказ и свяжемся с тобой по
                      деталям.
                    </p>
                  </div>

                  <form className="grid gap-4" onSubmit={handleSubmit}>
                    {[
                      ["name", "Имя", "Как к тебе обращаться"],
                      ["phone", "Телефон", "+7 999 123-45-67"],
                      ["telegram", "Telegram", "@username"],
                      ["whatsapp", "WhatsApp", "+7 999 123-45-67"],
                      ["city", "Город", "Москва"],
                    ].map(([field, label, placeholder]) => (
                      <label key={field} className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#706778]">
                          {label}
                        </span>
                        <input
                          required={field === "name" || field === "phone" || field === "city"}
                          value={form[field as keyof typeof form]}
                          onChange={(event) =>
                            startTransition(() =>
                              setForm((currentForm) => ({
                                ...currentForm,
                                [field]: event.target.value,
                              }))
                            )
                          }
                          placeholder={placeholder}
                          className="w-full rounded-[1.25rem] border border-[#17111e]/10 bg-white/80 px-4 py-3 text-sm outline-none transition placeholder:text-[#8d8390] focus:border-[#29d6cf]"
                        />
                      </label>
                    ))}

                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#706778]">
                        Адрес
                      </span>
                      <textarea
                        required
                        rows={4}
                        value={form.address}
                        onChange={(event) =>
                          setForm((currentForm) => ({
                            ...currentForm,
                            address: event.target.value,
                          }))
                        }
                        placeholder="Улица, дом, квартира, ориентир"
                        className="w-full rounded-[1.25rem] border border-[#17111e]/10 bg-white/80 px-4 py-3 text-sm outline-none transition placeholder:text-[#8d8390] focus:border-[#29d6cf]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#706778]">
                        Комментарий
                      </span>
                      <textarea
                        rows={4}
                        value={form.notes}
                        onChange={(event) =>
                          setForm((currentForm) => ({
                            ...currentForm,
                            notes: event.target.value,
                          }))
                        }
                        placeholder="Например: удобное время связи, пожелания по доставке"
                        className="w-full rounded-[1.25rem] border border-[#17111e]/10 bg-white/80 px-4 py-3 text-sm outline-none transition placeholder:text-[#8d8390] focus:border-[#29d6cf]"
                      />
                    </label>

                    {error ? (
                      <p className="rounded-[1.25rem] border border-[#e7402a]/20 bg-[#e7402a]/8 px-4 py-3 text-sm text-[#a22518]">
                        {error}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#17111e] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#e7402a] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <LoaderCircle className="size-4 animate-spin" />
                          Отправляем заказ
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="size-4" />
                          Подтвердить заказ
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </section>

              <aside className="surface-panel rounded-[2.4rem] p-6">
                <p className="text-xs uppercase tracking-[0.32em] text-[#706778]">Состав заказа</p>
                <div className="mt-5 space-y-4">
                  {items.map((item) => (
                    <article
                      key={item.cartKey}
                      className="rounded-[1.6rem] border border-[#17111e]/10 bg-white/75 p-4"
                    >
                      <div className="flex gap-4">
                        <div
                          className="h-20 w-20 rounded-[1.2rem] bg-cover bg-center"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-semibold text-[#17111e]">
                            {item.productTitle}
                          </p>
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#706778]">
                            {item.color ? `${item.color}` : "Без цвета"}
                            {item.size ? ` • ${item.size}` : ""}
                            {` • ${item.quantity} шт.`}
                          </p>
                          <PriceText value={item.price * item.quantity} className="mt-3 text-sm text-[#17111e]" />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.8rem] border border-[#17111e]/10 bg-[#17111e] p-5 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/65">Итого</span>
                    <PriceText value={subtotal} className="text-3xl text-white" />
                  </div>
                  <p className="mt-4 text-xs leading-5 text-white/45">
                    Стоимость доставки уточним при подтверждении заказа.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
