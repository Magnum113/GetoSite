import { formatPriceAmount } from "@/lib/catalog";

type PriceTextProps = {
  value: number;
  className?: string;
  symbolClassName?: string;
};

export function PriceText({ value, className = "", symbolClassName = "" }: PriceTextProps) {
  return (
    <span
      className={`flex w-fit items-baseline gap-[0.08em] font-price font-bold leading-none tracking-[-0.05em] tabular-nums ${className}`.trim()}
    >
      <span>{formatPriceAmount(value)}</span>
      <span className={`text-[0.84em] tracking-[-0.03em] ${symbolClassName}`.trim()}>₽</span>
    </span>
  );
}
