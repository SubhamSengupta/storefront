import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the products in your cart.",
};

export default function CartPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Your cart</h1>
      <CartView />
    </div>
  );
}
