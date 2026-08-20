import type { Product } from "@/lib/types/product";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
}

/** Responsive grid of product cards. The first row eager-loads its images. */
export function ProductGrid({ products }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard product={product} priority={index < 4} />
        </li>
      ))}
    </ul>
  );
}
