"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import PaymentIcon from '@mui/icons-material/Payment';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Session } from "@/types/type";
import Link from "next/link";
import { TextField } from "@mui/material";

interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    name: string;
    description: string;
    image: string[];
}

interface ProfileData {
    bio: string | null;
    location: string | null;
    address: string | null;
    mobile: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

export default function CartCheckOut({
    profileData,
    cartData,
    session,
}: {
    profileData: ProfileData;
    cartData: CartItem[];
    session: Session;
}) {
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);

    // Calculate totals
    const subtotal = useMemo(
        () => cartData.reduce((acc, item) => acc + item.price * item.quantity, 0),
        [cartData]
    );
    const total = subtotal - discount;

    const handleApplyCoupon = () => {
        if (coupon.trim().toLowerCase() === "save10") {
            setDiscount(subtotal * 0.1);
            toast.success("Coupon applied! You saved 10%");
        } else {
            setDiscount(0);
            toast.error("Invalid coupon code");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-3 md:px-6 py-6">
            {/* GRID LAYOUT: Two Columns on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-6">
                    {/* --- Shipping Info --- */}
                    <Card className="shadow-sm shadow-sm border border-border">
                        <CardHeader>
                            <CardTitle className="text-md">
                                Shipping Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm text-muted-foreground">
                            <p>
                                <span className="font-medium text-foreground">Name:</span>{" "}
                                {session?.user.name}
                            </p>
                            <p>
                                <span className="font-medium text-foreground">Mobile:</span>{" "}
                                {profileData.mobile}
                            </p>
                            <p>
                                <span className="font-medium text-foreground">Address:</span>{" "}
                                {profileData.address}
                            </p>

                        </CardContent>
                    </Card>

                    {/* --- Cart Items --- */}
                    <Card className="shadow-sm border border-border">
                        <CardHeader>
                            <CardTitle className="text-md ">
                                Your Cart
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {cartData.length === 0 ? (
                                <p className="text-muted-foreground text-center">
                                    Your cart is empty.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {cartData.map((item) => (
                                        <div
                                            key={item.productId}
                                            className="flex items-center gap-4 border-b pb-4"
                                        >
                                            <Link href={`/product/${item.productId}`} className="block">
                                                <Image
                                                    src={item.image?.[0] || "/placeholder.png"}
                                                    alt={item.name || "Product"}
                                                    width={50}
                                                    height={50}
                                                    className="object-contain rounded-md"
                                                />
                                            </Link>

                                            <div className="flex-1">
                                                <h3 className="font-medium text-xs md:text-sm">{item.name}</h3>

                                                <p className="text-gray-400 text-xs mt-1">
                                                    ₹{item.price} × {item.quantity}
                                                </p>
                                            </div>

                                            {/* Price Counter */}
                                            <div className="flex items-center gap-1">


                                                <span className="min-w-[20px] text-sm text-muted-foreground text-center">{(item.price) * (item.quantity)}</span>


                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                    {/* --- Coupon Section --- */}
                    <Card className="shadow-sm border border-border">
                        <CardHeader>
                            <CardTitle className="text-md ">
                                Apply Coupon
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-3">
                                <TextField
                                    id="outlined-basic"
                                    size="small"
                                    label="Have a coupon?"
                                    variant="outlined"
                                   
                                />
                                <Button
                                    variant="outline"
                                    className=" w-[100px]  text-sm font-semibold border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors"

                                    onClick={handleApplyCoupon}
                                >
                                    Apply
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* --- Order Summary --- */}
                    <Card className="shadow-sm border border-border">
                        <CardHeader>
                            <CardTitle className="text-md ">
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Discount</span>
                                <span>- ₹{discount.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-base font-semibold">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>

                            <div className="flex mx-auto w-full justify-center">
                            <Button 
                             className=" w-[210px]  text-sm font-semibold border-primary 
                            text-white  bg-primary hover:bg-white hover:text-primary transition-colors"
                            variant="outline">
                                Proceed to Payment
                                <PaymentIcon className=" ml-2 !transition-colors duration-200"/>
                            </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
