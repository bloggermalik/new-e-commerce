"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { OrderItem, Product, UserOrder } from "@/types/type";
import Image from "next/image";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "./ui/button";
import Link from "next/link";
import ReviewDialog from "./review-dialog";




export default function OrderPage({ usersOrders }: { usersOrders: UserOrder[] }) {
  if (!usersOrders || usersOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 text-lg">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-0 sm:px-4 pt-6 space-y-6">
      <h1 className="text-xl font-bold mb-6 mx-auto">My Orders</h1>

      <div className="space-y-6">
        {usersOrders.map((order, index) => {
          if (order.status === "pending" || order.paymentStatus !== "paid") { return null; }
          const address = JSON.parse(order.shippingAddress);
          return (
            <Card key={order.id} className="!border-none !px-0 py-0  shadow-none">
              <CardHeader className=" flex flex-col px-4 sm:px-6 gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Order {order.orderNumber}
                  </CardTitle>
                  <p className="text-xs text-gray-500">
                    Placed on {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
                <div className="flex gap-2">
                

                  <Badge variant="secondary" className="capitalize">
                    {order.status}
                  </Badge>
                </div>


              </CardHeader>

              <CardContent className="space-y-4 px-4 sm:px-6">
                <div className="space-y-4">
                  <div className="bg-primary/9 rounded-lg p-2 sm:p-4">
                    {order.orderItems.map((item: OrderItem & { product: Product }) => {
                      const imageUrl = item?.product?.variants?.[0]?.images?.[0] || '/placeholder.png';

                      return (

                        <div
                          key={item.id}
                          className="flex justify-between items-start px-2 py-4 rounded-lg"
                        >
                          <div className="flex items-start">
                            <Link href={`/product/${item.product?.id}`}>
                              <Image
                                src={imageUrl}
                                alt={item.product?.name || "Product image"}
                                width={40}
                                height={40}
                                className="w-10 h-10 object-cover rounded-md mr-4"
                              />
                            </Link>
                            <div>
                              <Link href={`/product/${item.product?.id}`}>
                                <p className="font-medium text-xs text-gray-800">
                                  {item.product?.name}
                                </p>
                              </Link>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity} × ₹{item.price}
                                <ReviewDialog
                                  orderId={order.id}
                                  productId={item.productId}
                                  userId={order.userId}
                                  name={item.product?.name || ""}
                                >
                                  <button className="text-xs ml-2 text-primary underline cursor-pointer">
                                    Write a Review
                                  </button>
                                </ReviewDialog>
                              </p>
                            </div>
                          </div>

                          <p className="font-medium text-xs text-gray-800 ml-4">₹{item.total}</p>
                        </div>

                      )
                    })}
                  </div>
                </div>

                {/* Drawer Code When click on more button */}
                <div className="flex flex-row justify-between   ">
                  <div>
                    <Drawer>
                      <DrawerTrigger asChild>
                        <div>
                          <Button variant="outline" className=
                            "text-xs sm:text-sm h-6 sm:h-8 font-semibold border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors">More</Button>
                        </div>
                      </DrawerTrigger>
                      <DrawerContent className="p-4 sm:p-6 mb-10">
                        <DrawerHeader className="  mb-4">
                          <DrawerTitle className="text-xl font-semibold">
                            Order Summary
                          </DrawerTitle>
                          <DrawerDescription className="text-sm text-gray-600">
                            Review your shipping and payment details below
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="max-w-xl w-full mx-auto">
                          {/* Shipping Info */}
                          <div className="space-y-2 mb-6">
                            <h3 className="font-semibold text-md">Shipping Address</h3>
                            <div className="text-sm text-gray-700 leading-6 border rounded-lg p-3 bg-gray-50">
                              <p>{address?.name || "John Doe"}</p>
                              <p>{address?.address || "123 Main Street, Mumbai"}</p>
                              <p> {address?.phone || "+91 98765 43210"}</p>
                            </div>
                          </div>

                          {/* Payment Info */}
                          <div className="space-y-2 mb-6">
                            <h3 className="font-semibold text-md">Payment Information</h3>
                            <div className="text-sm text-gray-700 leading-6 border rounded-lg p-3 bg-gray-50">
                              <p>Payment Status:  <Badge
                                className={`capitalize ${order.paymentStatus === "paid"
                                  ? "bg-green-600 text-white"
                                  : "bg-yellow-500 text-white"
                                  }`}
                              >
                                {order.paymentStatus}
                              </Badge></p>
                            </div>
                          </div>

                          {/* Price Details */}
                          <div className="space-y-3 border-t pt-4">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">Subtotal</span>
                              <span>₹{order?.subtotal || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">Tax</span>
                              <span>₹{order?.tax || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">Discount</span>
                              <span className="text-green-600">-₹{order?.discount || 0}</span>
                            </div>

                            <div className="border-t pt-3 flex justify-between font-semibold text-sm">
                              <span>Total</span>
                              <span className="text-md ">₹{order?.total || 0}</span>
                            </div>
                          </div>
                        </div>
                        <DrawerFooter className="mt-6">
                          <DrawerClose asChild>
                            <Button variant="outline" className="w-[100px] mx-auto text-sm font-semibold border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors">
                              Close
                            </Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </div>

                  <div className="text-right space-y-1">

                    <p className="font-semibold text-sm ">
                      Total: ₹{order.total}
                    </p>
                  </div>
                </div>
              </CardContent>
              {index !== usersOrders?.length - 1 && <Separator />}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
