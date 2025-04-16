"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Dummy product data
const products = [
  {
    id: 1,
    name: "Classic White Shirt",
    description: "A timeless classic for any wardrobe.",
    price: 29.99,
    imageUrl: "https://picsum.photos/200/300",
  },
  {
    id: 2,
    name: "Stylish Black Jeans",
    description: "Comfortable and versatile black jeans.",
    price: 59.99,
    imageUrl: "https://picsum.photos/200/300",
  },
  {
    id: 3,
    name: "Elegant Silk Scarf",
    description: "Add a touch of elegance with this silk scarf.",
    price: 39.99,
    imageUrl: "https://picsum.photos/200/300",
  },
];

export default function Home() {
  const [cart, setCart] = useState<number[]>([]);
  const [checkoutInfo, setCheckoutInfo] = useState({
    name: "",
    address: "",
    payment: "",
  });
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  const addToCart = (productId: number) => {
    setCart([...cart, productId]);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((id) => id !== productId));
  };

  const handleCheckout = () => {
    if (
      checkoutInfo.name.trim() === "" ||
      checkoutInfo.address.trim() === "" ||
      checkoutInfo.payment.trim() === ""
    ) {
      setCheckoutMessage("Please fill in all checkout information.");
      return;
    }

    // Simulate checkout process
    setTimeout(() => {
      // Simulate success or failure
      const success = Math.random() < 0.8;
      setCheckoutMessage(
        success ? "Checkout successful!" : "Checkout failed. Please try again."
      );
      if (success) {
        setCart([]);
        setCheckoutInfo({ name: "", address: "", payment: "" });
      }
    }, 1500);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">StyleCart</h1>

      {/* Product Catalog */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Product Catalog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="mb-3 rounded-md"
                />
                <p className="text-lg font-semibold">${product.price}</p>
                {cart.includes(product.id) ? (
                  <Button
                    variant="destructive"
                    onClick={() => removeFromCart(product.id)}
                  >
                    Remove from Cart
                  </Button>
                ) : (
                  <Button onClick={() => addToCart(product.id)}>
                    Add to Cart
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-4" />

      {/* Shopping Cart */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Shopping Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="list-disc pl-5">
            {cart.map((productId) => {
              const product = products.find((p) => p.id === productId);
              return (
                product && (
                  <li key={product.id} className="mb-2">
                    {product.name} - ${product.price}
                  </li>
                )
              );
            })}
          </ul>
        )}
      </section>

      <Separator className="my-4" />

      {/* Checkout Simulation */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Checkout Simulation</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={checkoutInfo.name}
              onChange={(e) =>
                setCheckoutInfo({ ...checkoutInfo, name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={checkoutInfo.address}
              onChange={(e) =>
                setCheckoutInfo({ ...checkoutInfo, address: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="payment">Payment Information</Label>
            <Input
              id="payment"
              value={checkoutInfo.payment}
              onChange={(e) =>
                setCheckoutInfo({ ...checkoutInfo, payment: e.target.value })
              }
            />
          </div>
          <Button onClick={handleCheckout}>Complete Checkout</Button>
          {checkoutMessage && <p className="mt-3">{checkoutMessage}</p>}
        </div>
      </section>
    </div>
  );
}
