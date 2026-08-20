import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types/product";
import { formatPrice } from "@/lib/format";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Rating } from "./rating";

interface ProductCardProps {
  product: Product;
  /**
   * Marks this as the LCP image: eager-loads + preloads it and hints
   * fetchPriority="high". Set only on the first card — making several images
   * high-priority just makes them compete for bandwidth and delays the LCP.
   */
  priority?: boolean;
}

/**
 * A single product tile: image, title, price and rating. The whole card is a
 * link to the product detail page. Rendered on the server as part of the ISR
 * catalog — no client JS.
 */
export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <Card className="group h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
      <Link
        href={`/products/${product.id}`}
        className="focus-visible:ring-ring flex h-full flex-col rounded-xl focus:outline-none focus-visible:ring-2"
      >
        <div className="bg-muted relative aspect-square overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
            fetchPriority={priority ? "high" : undefined}
          />
        </div>
        <CardContent className="flex flex-1 flex-col gap-2 p-4">
          <h2 className="line-clamp-2 text-sm font-medium">{product.title}</h2>
          <Rating value={product.rating} />
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <span className="text-lg font-semibold">
            {formatPrice(product.price)}
          </span>
        </CardFooter>
      </Link>
    </Card>
  );
}
