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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

type CartItem = {
  productId: number;
  size: string;
  quantity: number;
};

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutInfo, setCheckoutInfo] = useState({
    name: "",
    address: "",
    payment: "",
  });
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<{ [productId: number]: string }>({});
  const [itemQuantities, setItemQuantities] = useState<{ [productId: number]: number }>({});


  const addToCart = (productId: number) => {
    const size = selectedSize[productId] || "M";
    const quantity = itemQuantities[productId] || 1;

    const existingCartItem = cart.find(item => item.productId === productId && item.size === size);

    if (existingCartItem) {
      // If the item already exists in the cart with the same size, update the quantity
      const updatedCart = cart.map(item =>
        item.productId === productId && item.size === size
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCart(updatedCart);
    } else {
      // If the item doesn't exist, add it to the cart
      setCart([...cart, { productId, size, quantity }]);
    }

    // Reset quantity for the product
    setItemQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: 1, // Reset to 1 after adding to cart
    }));
  };


  const removeFromCart = (productId: number, size: string) => {
    setCart(cart.filter((item) => item.productId !== productId || item.size !== size));
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
        setItemQuantities({});
        setSelectedSize({});
      }
    }, 1500);
  };

  const handleQuantityIncrease = (productId: number) => {
    setItemQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 1) + 1,
    }));
  };

  const handleQuantityDecrease = (productId: number) => {
    setItemQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: Math.max(1, (prevQuantities[productId] || 1) - 1),
    }));
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

                {/* Size Selection */}
                <div className="mb-3">
                  <Label htmlFor={`size-${product.id}`} className="block text-sm font-medium text-gray-700">
                    Size
                  </Label>
                  <Select
                    id={`size-${product.id}`}
                    value={selectedSize[product.id] || "M"}
                    onValueChange={(value) =>
                      setSelectedSize({ ...selectedSize, [product.id]: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S">S (UK)</SelectItem>
                      <SelectItem value="M">M (UK)</SelectItem>
                      <SelectItem value="L">L (UK)</SelectItem>
                      <SelectItem value="XL">XL (UK)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                 {/* Quantity Selection */}
                <div className="mb-3 flex items-center space-x-2">
                  <Label htmlFor={`quantity-${product.id}`} className="block text-sm font-medium text-gray-700">
                    Quantity:
                  </Label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityDecrease(product.id)}
                      disabled={itemQuantities[product.id] === 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      id={`quantity-${product.id}`}
                      value={itemQuantities[product.id] || 1}
                      className="w-16 text-center"
                      readOnly
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityIncrease(product.id)}
                    >
                      +
                    </Button>
                  </div>
                </div>


                {cart.find(item => item.productId === product.id && item.size === (selectedSize[product.id] || "M")) ? (
                  <Button
                    variant="destructive"
                    onClick={() => removeFromCart(product.id, selectedSize[product.id] || "M")}
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
            {cart.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              return (
                product && (
                  <li key={`${product.id}-${item.size}`} className="mb-2">
                    {product.name} - Size: {item.size}, Quantity: {item.quantity} - ${product.price * item.quantity}
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => removeFromCart(product.id, item.size)}
                    >
                      Remove
                    </Button>
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
