export type CatalogSizeGuide = {
  title: string;
  rows: string[][];
};

export type CatalogVariant = {
  id: string;
  productId: number;
  sku: number;
  offerId: string;
  name: string;
  size: string | null;
  ruSize: string | null;
  color: string | null;
  colorLabel: string | null;
  badge: string | null;
  price: number;
  oldPrice: number | null;
  minPrice: number | null;
  stock: number;
  inStock: boolean;
  primaryImage: string;
  images: string[];
  video: string | null;
  description: string;
  composition: string | null;
  care: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CatalogProduct = {
  id: string;
  modelId: number;
  slug: string;
  title: string;
  kind: string;
  badge: string | null;
  subtitle: string;
  description: string;
  composition: string | null;
  care: string | null;
  sizeGuide: CatalogSizeGuide | null;
  gallery: string[];
  videos: string[];
  tags: string[];
  colors: string[];
  sizes: string[];
  features: string[];
  stockTotal: number;
  inStock: boolean;
  priceFrom: number;
  priceTo: number;
  oldPriceFrom: number | null;
  oldPriceTo: number | null;
  discountPercent: number | null;
  createdAt: string;
  updatedAt: string;
  variantCount: number;
  variants: CatalogVariant[];
};

export type CatalogMeta = {
  storeName: string;
  importedAt: string;
  skuCount: number;
  productCount: number;
};

export type CatalogData = {
  meta: CatalogMeta;
  products: CatalogProduct[];
};

export type CartItem = {
  cartKey: string;
  productId: string;
  productSlug: string;
  productTitle: string;
  variantId: string;
  variantName: string;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
  image: string;
};

export type CheckoutPayload = {
  items: CartItem[];
  subtotal: number;
  customer: {
    name: string;
    phone: string;
    telegram?: string;
    whatsapp?: string;
    city: string;
    address: string;
    notes?: string;
  };
};
