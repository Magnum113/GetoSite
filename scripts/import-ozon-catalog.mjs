import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

if (typeof process.loadEnvFile === "function") {
  process.loadEnvFile();
}

const API_BASE = "https://api-seller.ozon.ru";
const STORE_NAME = "GETO";
const BATCH_SIZE = 50;
const clientId = process.env.OZON_SELLER_ID;
const apiKey = process.env.OZON_SELLER_API_TOKEN;

if (!clientId || !apiKey) {
  console.error("OZON_SELLER_ID or OZON_SELLER_API_TOKEN is missing in .env");
  process.exit(1);
}

const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "XXL", "3XL", "4XL", "5XL"];

async function post(pathname, body) {
  const response = await fetch(`${API_BASE}${pathname}`, {
    method: "POST",
    headers: {
      "Client-Id": clientId,
      "Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let payload;

  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON from ${pathname}: ${text}`);
  }

  if (!response.ok) {
    throw new Error(`${pathname} responded with ${response.status}: ${text}`);
  }

  if (payload?.code && payload?.message) {
    throw new Error(`${pathname} failed with code ${payload.code}: ${payload.message}`);
  }

  return payload;
}

function chunk(items, size) {
  const result = [];

  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }

  return result;
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function cleanSpaces(value) {
  return value.replace(/\s+/g, " ").trim();
}

function stripHtml(value) {
  if (!value) {
    return "";
  }

  return cleanSpaces(
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
  );
}

function uniqueStrings(items) {
  return [...new Set(items.filter(Boolean).map((item) => cleanSpaces(String(item))))];
}

function getAttributeMap(productAttributes) {
  return new Map((productAttributes?.attributes ?? []).map((attribute) => [attribute.id, attribute]));
}

function getAttributeValues(attributeMap, id) {
  const values = attributeMap.get(id)?.values ?? [];
  return values
    .map((item) => item?.value)
    .filter((item) => typeof item === "string" && item.trim().length > 0)
    .map((item) => cleanSpaces(item));
}

function getAttributeText(attributeMap, id) {
  const values = getAttributeValues(attributeMap, id);
  return values.length > 0 ? values.join(", ") : null;
}

function getVideoUrl(productAttributes) {
  const complexAttributes = productAttributes?.complex_attributes ?? [];

  for (const attribute of complexAttributes) {
    for (const value of attribute.values ?? []) {
      if (typeof value?.value === "string" && value.value.startsWith("http")) {
        return value.value;
      }
    }
  }

  return null;
}

function parseTags(value) {
  if (!value) {
    return [];
  }

  return uniqueStrings(
    value
      .split(/\s+/)
      .map((token) => token.replace(/^#+/, ""))
      .filter(Boolean)
  );
}

function parseSizeGuide(value) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    const table = parsed?.content?.find((item) => item?.widgetName === "tcTable")?.table;

    if (!table?.body?.length) {
      return null;
    }

    const rows = table.body
      .map((row) =>
        (row?.data ?? []).map((cell) => {
          if (Array.isArray(cell)) {
            return cleanSpaces(cell.filter(Boolean).join(" "));
          }

          return cleanSpaces(String(cell ?? ""));
        })
      )
      .filter((row) => row.some(Boolean));

    if (rows.length === 0) {
      return null;
    }

    return {
      title: cleanSpaces(table.title ?? "Размеры"),
      rows,
    };
  } catch {
    return null;
  }
}

function toOutputVariant(variant) {
  return {
    id: variant.id,
    productId: variant.productId,
    sku: variant.sku,
    offerId: variant.offerId,
    name: variant.name,
    size: variant.size,
    ruSize: variant.ruSize,
    color: variant.color,
    colorLabel: variant.colorLabel,
    badge: variant.badge,
    price: variant.price,
    oldPrice: variant.oldPrice,
    minPrice: variant.minPrice,
    stock: variant.stock,
    inStock: variant.inStock,
    primaryImage: variant.primaryImage,
    images: variant.images,
    video: variant.video,
    description: variant.description,
    composition: variant.composition,
    care: variant.care,
    createdAt: variant.createdAt,
    updatedAt: variant.updatedAt,
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildStandalonePattern(values) {
  const normalizedValues = uniqueStrings(values)
    .map((value) => value.toLowerCase())
    .sort((left, right) => right.length - left.length);

  if (normalizedValues.length === 0) {
    return null;
  }

  return new RegExp(
    `(^|[\\s,()/-])(?:${normalizedValues.map((value) => escapeRegExp(value)).join("|")})(?=$|[\\s,()/-])`,
    "giu"
  );
}

function detectKind(value) {
  const lower = value.toLowerCase();

  if (lower.includes("худи")) {
    return "Худи";
  }

  if (lower.includes("свитшот")) {
    return "Свитшот";
  }

  return "Футболка";
}

function detectBadge(value) {
  const lower = value.toLowerCase();

  if (lower.includes("вышив")) {
    return "Вышивка";
  }

  if (lower.includes("принт")) {
    return "Принт";
  }

  return null;
}

function transliterate(value) {
  const map = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };

  return value
    .toLowerCase()
    .split("")
    .map((character) => map[character] ?? character)
    .join("");
}

function slugify(value) {
  return transliterate(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function sizeRank(value) {
  if (!value) {
    return 999;
  }

  const upper = value.toUpperCase();
  const directIndex = sizeOrder.indexOf(upper);

  if (directIndex >= 0) {
    return directIndex;
  }

  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return 100 + numeric;
  }

  return 999;
}

function selectLongest(values) {
  return [...values].sort((left, right) => right.length - left.length)[0] ?? null;
}

function selectMostCommon(values) {
  const counts = new Map();

  for (const value of values.filter(Boolean)) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;
}

function normalizeSizedTitle(name) {
  let result = cleanSpaces(name);

  result = result.replace(/\b(XS|S|M|L|XL|XXL|2XL|3XL|4XL|5XL)\b/gi, " ");
  result = result.replace(/\b\d{2,3}\b/gi, " ");

  return cleanSpaces(result)
    .replace(/\s{2,}/g, " ")
    .replace(/\s+,/g, ",")
    .replace(/\s+-\s+/g, " ");
}

function buildColorPattern(color) {
  const lower = color.toLowerCase();

  if (lower.includes("бел")) {
    return buildStandalonePattern(["белый", "белая", "белое"]);
  }

  if (lower.includes("чер")) {
    return buildStandalonePattern(["черный", "черная", "черное"]);
  }

  if (lower.includes("сер")) {
    return buildStandalonePattern(["серый", "серая", "серое"]);
  }

  if (lower.includes("беж")) {
    return buildStandalonePattern(["бежевый", "бежевая", "бежевое"]);
  }

  if (lower.includes("син")) {
    return buildStandalonePattern([
      "синий",
      "синяя",
      "синее",
      "темно-синий",
      "темно синяя",
      "темно синий",
    ]);
  }

  return buildStandalonePattern([color]);
}

function canonicalGroupTitle(name, color) {
  let result = cleanSpaces(name);

  result = result.replace(/\b(XS|S|M|L|XL|XXL|2XL|3XL|4XL|5XL)\b/gi, " ");
  result = result.replace(/\b\d{2,3}\b/gi, " ");

  if (color) {
    const colorPattern = buildColorPattern(color);

    if (colorPattern) {
      result = result.replace(colorPattern, "$1");
    }
  }

  return cleanSpaces(result)
    .replace(/\s{2,}/g, " ")
    .replace(/\s+,/g, ",")
    .replace(/\s+-\s+/g, " ");
}

function buildVariant(info, productAttributes) {
  const attributeMap = getAttributeMap(productAttributes);
  const size = getAttributeText(attributeMap, 9533);
  const ruSize = getAttributeText(attributeMap, 4295);
  const color = getAttributeText(attributeMap, 10096);
  const colorLabel = getAttributeText(attributeMap, 10097) ?? color;
  const description = stripHtml(getAttributeText(attributeMap, 4191) ?? "");
  const composition = getAttributeText(attributeMap, 4604) ?? getAttributeText(attributeMap, 4496);
  const care = getAttributeText(attributeMap, 4655);
  const stock = (info.stocks?.stocks ?? []).reduce(
    (sum, item) => sum + (Number(item?.present ?? 0) || 0),
    0
  );

  return {
    id: String(info.id),
    productId: info.id,
    sku: info.sku,
    offerId: info.offer_id,
    name: info.name,
    size,
    ruSize,
    color,
    colorLabel,
    badge: detectBadge(info.name),
    price: toNumber(info.price) ?? 0,
    oldPrice: toNumber(info.old_price),
    minPrice: toNumber(info.min_price),
    stock,
    inStock: stock > 0,
    primaryImage: info.primary_image?.[0] ?? info.images?.[0] ?? "",
    images: uniqueStrings([...(info.primary_image ?? []), ...(info.images ?? [])]),
    video: getVideoUrl(productAttributes),
    description,
    composition,
    care,
    createdAt: info.created_at,
    updatedAt: info.updated_at,
    groupTitle: canonicalGroupTitle(info.name, color),
    sourceModelId: info.model_info?.model_id ?? info.id,
    tags: parseTags(getAttributeText(attributeMap, 23171)),
    sizeGuide: parseSizeGuide(getAttributeText(attributeMap, 13164)),
    fit: getAttributeText(attributeMap, 23077),
    handcrafted: getAttributeText(attributeMap, 22270),
    materials: getAttributeValues(attributeMap, 4496),
    gender: getAttributeValues(attributeMap, 9163),
    shortLabel: getAttributeText(attributeMap, 22390),
  };
}

function buildProduct(variants) {
  const productId = variants[0].productId;
  const sourceModelId = variants[0].sourceModelId;
  const colors = uniqueStrings(variants.map((variant) => variant.color).filter(Boolean));
  const sizes = uniqueStrings(variants.map((variant) => variant.size).filter(Boolean)).sort(
    (left, right) => sizeRank(left) - sizeRank(right)
  );
  const displayTitles = variants.map((variant) => normalizeSizedTitle(variant.name));
  const title = selectMostCommon(displayTitles) ?? displayTitles[0] ?? variants[0].name;
  const prices = variants.map((variant) => variant.price).filter((value) => value > 0);
  const oldPrices = variants.map((variant) => variant.oldPrice).filter((value) => value && value > 0);
  const gallery = uniqueStrings(variants.flatMap((variant) => variant.images)).slice(0, 10);
  const videos = uniqueStrings(variants.map((variant) => variant.video).filter(Boolean));
  const description = selectLongest(variants.map((variant) => variant.description).filter(Boolean)) ?? "";
  const composition = selectMostCommon(variants.map((variant) => variant.composition)) ?? null;
  const care = selectLongest(variants.map((variant) => variant.care).filter(Boolean)) ?? null;
  const sizeGuide = variants.find((variant) => variant.sizeGuide)?.sizeGuide ?? null;
  const tags = uniqueStrings(variants.flatMap((variant) => variant.tags)).slice(0, 12);
  const features = uniqueStrings(
    variants.flatMap((variant) => [
      variant.badge,
      variant.fit,
      variant.handcrafted,
      ...variant.gender,
      ...variant.materials,
    ])
  ).slice(0, 6);
  const stockTotal = variants.reduce((sum, variant) => sum + variant.stock, 0);
  const createdAt = [...variants].sort((left, right) => left.createdAt.localeCompare(right.createdAt))[0]
    ?.createdAt;
  const updatedAt = [...variants].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0]
    ?.updatedAt;
  const priceFrom = Math.min(...prices);
  const priceTo = Math.max(...prices);
  const oldPriceFrom = oldPrices.length > 0 ? Math.min(...oldPrices) : null;
  const oldPriceTo = oldPrices.length > 0 ? Math.max(...oldPrices) : null;
  const discountPercent =
    oldPriceFrom && oldPriceFrom > priceFrom
      ? Math.round(((oldPriceFrom - priceFrom) / oldPriceFrom) * 100)
      : null;
  const subtitle = uniqueStrings([
    detectBadge(title),
    composition,
    variants.find((variant) => variant.shortLabel)?.shortLabel,
  ])
    .filter(Boolean)
    .slice(0, 2)
    .join(" • ");

  const normalizedVariants = [...variants]
    .sort((left, right) => {
      if ((left.color ?? "") !== (right.color ?? "")) {
        return (left.color ?? "").localeCompare(right.color ?? "");
      }

      return sizeRank(left.size ?? left.ruSize) - sizeRank(right.size ?? right.ruSize);
    })
    .map((variant) => toOutputVariant(variant));

  return {
    id: String(productId),
    modelId: sourceModelId,
    slug: `${slugify(title)}-${productId}`,
    title,
    kind: detectKind(title),
    badge: detectBadge(title),
    subtitle,
    description,
    composition,
    care,
    sizeGuide,
    gallery,
    videos,
    tags,
    colors,
    sizes,
    features,
    stockTotal,
    inStock: variants.some((variant) => variant.inStock),
    priceFrom,
    priceTo,
    oldPriceFrom,
    oldPriceTo,
    discountPercent,
    createdAt,
    updatedAt,
    variantCount: variants.length,
    variants: normalizedVariants,
  };
}

async function fetchAllIds() {
  const productIds = [];
  let lastId = "";

  while (true) {
    const payload = await post("/v3/product/list", {
      filter: {
        visibility: "ALL",
      },
      last_id: lastId,
      limit: 100,
    });

    const items = payload?.result?.items ?? [];

    for (const item of items) {
      if (!item.archived) {
        productIds.push(item.product_id);
      }
    }

    lastId = payload?.result?.last_id ?? "";

    if (!lastId) {
      break;
    }
  }

  return productIds;
}

async function fetchCatalog() {
  const productIds = await fetchAllIds();
  const records = [];

  for (const ids of chunk(productIds, BATCH_SIZE)) {
    const [productInfo, productAttributes] = await Promise.all([
      post("/v3/product/info/list", { product_id: ids }),
      post("/v4/product/info/attributes", {
        filter: {
          product_id: ids,
        },
        limit: ids.length,
      }),
    ]);

    const infoMap = new Map((productInfo.items ?? []).map((item) => [item.id, item]));
    const attrMap = new Map((productAttributes.result ?? []).map((item) => [item.id, item]));

    for (const id of ids) {
      const info = infoMap.get(id);
      const attrs = attrMap.get(id);

      if (!info || !attrs || info.is_archived) {
        continue;
      }

      records.push({
        variant: buildVariant(info, attrs),
      });
    }
  }

  const grouped = new Map();

  for (const record of records) {
    const groupKey = [
      record.variant.sourceModelId || slugify(record.variant.groupTitle),
      slugify(record.variant.groupTitle),
      slugify(record.variant.color ?? record.variant.colorLabel ?? "no-color"),
    ].join("::");
    const variants = grouped.get(groupKey) ?? [];
    variants.push(record.variant);
    grouped.set(groupKey, variants);
  }

  const products = [...grouped.entries()]
    .map(([, variants]) => buildProduct(variants))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  return {
    meta: {
      storeName: STORE_NAME,
      importedAt: new Date().toISOString(),
      skuCount: records.length,
      productCount: products.length,
    },
    products,
  };
}

async function main() {
  const catalog = await fetchCatalog();
  const outputDir = path.join(process.cwd(), "src", "data");
  const outputPath = path.join(outputDir, "catalog.json");

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

  console.log(
    `Imported ${catalog.meta.skuCount} SKU into ${catalog.meta.productCount} products -> ${outputPath}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
