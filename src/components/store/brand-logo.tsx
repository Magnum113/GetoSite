import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className = "", priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/geto-logo.svg"
      alt="GETO"
      width={822}
      height={329}
      priority={priority}
      className={className}
    />
  );
}
