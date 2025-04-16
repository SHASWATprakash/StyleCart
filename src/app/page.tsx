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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Dummy product data
const products = [
  {
    id: 1,
    name: "Classic White Shirt",
    description: "A timeless classic for any wardrobe.",
    price: 29.99,
    imageUrl: "https://picsum.photos/200/300",
    gender: "Men",
    category: "Shirts",
    availableColors: ["White", "Blue", "Black"],
  },
  {
    id: 2,
    name: "Stylish Black Jeans",
    description: "Comfortable and versatile black jeans.",
    price: 59.99,
    imageUrl: "https://picsum.photos/200/300",
    gender: "Women",
    category: "Jeans",
    availableColors: ["Black", "Gray"],
  },
  {
    id: 3,
    name: "Elegant Silk Scarf",
    description: "Add a touch of elegance with this silk scarf.",
    price: 39.99,
    imageUrl: "https://picsum.photos/200/300",
    gender: "Women",
    category: "Accessories",
    availableColors: ["Red", "Green", "Purple"],
  },
];

type CartItem = {
  productId: number;
  size: string;
  quantity: number;
  color: string; // Added color to the cart item
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
  const [selectedColor, setSelectedColor] = useState<{ [productId: number]: string }>({}); // State for selected color


  const addToCart = (productId: number) => {
    const size = selectedSize[productId] || "M";
    const quantity = itemQuantities[productId] || 1;
    const color = selectedColor[productId] || products.find(p => p.id === productId)?.availableColors?.[0] || "N/A"; // Get selected color

    const existingCartItem = cart.find(item => item.productId === productId && item.size === size && item.color === color);

    if (existingCartItem) {
      // If the item already exists in the cart with the same size and color, update the quantity
      const updatedCart = cart.map(item =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCart(updatedCart);
    } else {
      // If the item doesn't exist, add it to the cart
      setCart([...cart, { productId, size, quantity, color }]);
    }

    // Reset quantity for the product
    setItemQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: 1, // Reset to 1 after adding to cart
    }));
  };


  const removeFromCart = (productId: number, size: string, color: string) => {
    setCart(cart.filter((item) => item.productId !== productId || item.size !== size || item.color !== color));
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
        setSelectedColor({});
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

                {/* Gender and Category */}
                <div className="mb-2">
                  <p>
                    <span className="font-semibold">Gender:</span> {product.gender}
                  </p>
                  <p>
                    <span className="font-semibold">Category:</span> {product.category}
                  </p>
                </div>

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

                {/* Color Selection */}
                <div className="mb-3">
                  <Label className="block text-sm font-medium text-gray-700">
                    Color
                  </Label>
                  <RadioGroup defaultValue={product.availableColors[0]} className="flex gap-2">
                    {product.availableColors.map((color) => (
                      <div key={color} className="flex items-center space-x-2">
                        <RadioGroupItem value={color} id={`color-${product.id}-${color}`} onClick={() => setSelectedColor({ ...selectedColor, [product.id]: color })} />
                        <Label htmlFor={`color-${product.id}-${color}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {color}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
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


                {cart.find(item => item.productId === product.id && item.size === (selectedSize[product.id] || "M") && item.color === (selectedColor[product.id] || product.availableColors[0])) ? (
                  <Button
                    variant="destructive"
                    onClick={() => removeFromCart(product.id, selectedSize[product.id] || "M", selectedColor[product.id] || product.availableColors[0])}
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
                  <li key={`${product.id}-${item.size}-${item.color}`} className="mb-2">
                    {product.name} - Size: {item.size}, Color: {item.color}, Quantity: {item.quantity} - ${product.price * item.quantity}
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => removeFromCart(product.id, item.size, item.color)}
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
