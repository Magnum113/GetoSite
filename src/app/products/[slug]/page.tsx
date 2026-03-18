import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/store/product-details";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { StoreProductCard } from "@/components/store/store-product-card";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Товар не найден",
    };
  }

  return {
    title: product.title,
    description: product.subtitle || product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);

  return (
    <>
      <SiteHeader />
      <main>
        <ProductDetails product={product} />

        <section className="px-4 pb-8 pt-2 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="surface-panel rounded-[2.2rem] p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.32em] text-[#706778]">Related drop</p>
              <h2 className="mt-3 font-display text-4xl text-[#17111e]">Похожие позиции</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.map((relatedProduct) => (
                  <StoreProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
