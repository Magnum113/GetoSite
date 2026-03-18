import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { z } from "zod";

const cartItemSchema = z.object({
  cartKey: z.string(),
  productId: z.string(),
  productSlug: z.string(),
  productTitle: z.string(),
  variantId: z.string(),
  variantName: z.string(),
  size: z.string().nullable(),
  color: z.string().nullable(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.string().url(),
});

const orderSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  subtotal: z.number().positive(),
  customer: z.object({
    name: z.string().min(2),
    phone: z.string().min(6),
    telegram: z.string().optional().or(z.literal("")),
    whatsapp: z.string().optional().or(z.literal("")),
    city: z.string().min(2),
    address: z.string().min(5),
    notes: z.string().optional().or(z.literal("")),
  }),
});

function createOrderId() {
  const date = new Date();
  const stamp = [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `GETO-${stamp}-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const payload = orderSchema.parse(await request.json());
    const orderId = createOrderId();
    const ordersDirectory = path.join(process.cwd(), "orders");
    const filePath = path.join(ordersDirectory, `${orderId}.json`);

    await mkdir(ordersDirectory, { recursive: true });
    await writeFile(
      filePath,
      `${JSON.stringify(
        {
          orderId,
          status: "new",
          createdAt: new Date().toISOString(),
          ...payload,
        },
        null,
        2
      )}\n`,
      "utf8"
    );

    return NextResponse.json({ orderId }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Некорректные данные заказа" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Не удалось сохранить заказ. Проверь серверную конфигурацию." },
      { status: 500 }
    );
  }
}
