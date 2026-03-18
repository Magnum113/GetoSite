"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { PriceText } from "@/components/store/price-text";
import { useCart } from "@/components/providers/cart-provider";

export function CartDrawer() {
  const { items, isOpen, subtotal, closeCart, removeItem, updateQuantity } = useCart();

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Закрыть корзину"
        onClick={closeCart}
        className={`absolute inset-0 bg-[#120d18]/55 backdrop-blur-sm transition ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-white/20 bg-[#170f21]/90 text-white shadow-[0_30px_90px_rgba(10,8,16,0.45)] backdrop-blur-2xl transition duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Корзина"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/45">Корзина</p>
            <h2 className="mt-2 font-display text-2xl">Твой дроп в сборе</h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full border border-white/15 p-2 text-white/75 transition hover:border-white/40 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <div className="rounded-full border border-white/10 bg-white/5 p-4">
              <ShoppingBag className="size-8 text-[#29d6cf]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-2xl">Пока пусто</h3>
              <p className="max-w-sm text-sm leading-6 text-white/60">
                Добавь футболку или худи, чтобы собрать свой сет и перейти к оформлению.
              </p>
            </div>
            <Link
              href="/#catalog"
              onClick={closeCart}
              className="rounded-full bg-[#f4b04d] px-5 py-3 text-sm font-semibold text-[#120d18] transition hover:bg-[#ffd08a]"
            >
              Открыть каталог
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              {items.map((item) => (
                <article
                  key={item.cartKey}
                  className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex gap-4">
                    <div
                      className="h-24 w-24 shrink-0 rounded-[1.4rem] bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/products/${item.productSlug}`}
                            onClick={closeCart}
                            className="line-clamp-2 text-sm font-semibold leading-6 transition hover:text-[#f4b04d]"
                          >
                            {item.productTitle}
                          </Link>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/45">
                            {item.color ? `${item.color}` : "Без цвета"}
                            {item.size ? ` • ${item.size}` : ""}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.cartKey)}
                          className="rounded-full border border-white/10 p-2 text-white/60 transition hover:border-white/30 hover:text-white"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                            className="rounded-full p-2 text-white/65 transition hover:text-white"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="min-w-10 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                            className="rounded-full p-2 text-white/65 transition hover:text-white"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <PriceText value={item.price * item.quantity} className="text-sm text-[#f4b04d]" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="border-t border-white/10 px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm text-white/70">
                <span>Товары</span>
                <PriceText value={subtotal} className="text-sm text-white/70" />
              </div>
              <p className="mb-5 text-xs leading-5 text-white/45">
                После оформления мы свяжемся с тобой и подтвердим детали заказа.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex items-center justify-center rounded-full bg-[#e7402a] px-5 py-3 text-sm font-semibold transition hover:bg-[#ff684f]"
              >
                Перейти к оформлению
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
