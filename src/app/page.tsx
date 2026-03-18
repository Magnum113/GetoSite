import { HeroSection } from "@/components/store/hero-section";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { StorefrontShell } from "@/components/store/storefront-shell";
import { catalog, getHeroProducts } from "@/lib/catalog";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection featuredProducts={getHeroProducts(6)} />
        <StorefrontShell products={catalog.products} meta={catalog.meta} />
      </main>
      <SiteFooter />
    </>
  );
}
