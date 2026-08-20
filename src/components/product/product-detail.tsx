import type { Product } from "@/lib/types/product";
import { formatPrice, discountedPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Rating } from "./rating";
import { ProductGallery } from "./product-gallery";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

/** Full product detail view. Server component; the only client bits are the
 * gallery (local UI state) and the add-to-cart button. */
export function ProductDetail({ product }: { product: Product }) {
  const hasDiscount = product.discountPercentage > 0;
  const finalPrice = discountedPrice(product.price, product.discountPercentage);
  const images =
    product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <article className="grid gap-8 lg:grid-cols-2">
      <ProductGallery images={images} title={product.title} />

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            {product.brand && <span>{product.brand}</span>}
            {product.brand && <span aria-hidden="true">·</span>}
            <span className="capitalize">{product.category}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
          <Rating value={product.rating} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl font-bold tabular-nums">
            {formatPrice(hasDiscount ? finalPrice : product.price)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-muted-foreground text-lg tabular-nums line-through">
                {formatPrice(product.price)}
              </span>
              <Badge variant="success">
                -{Math.round(product.discountPercentage)}%
              </Badge>
            </>
          )}
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>

        <Separator />

        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Availability</dt>
            <dd>{product.availabilityStatus}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">In stock</dt>
            <dd>{product.stock}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">SKU</dt>
            <dd>{product.sku}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Shipping</dt>
            <dd>{product.shippingInformation}</dd>
          </div>
        </dl>

        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
