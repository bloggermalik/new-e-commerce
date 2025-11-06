"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { UserOrder } from "@/types/type";
import Image from "next/image";



export default function OrderPage({ usersOrders }: { usersOrders: UserOrder[] }) {
  if (!usersOrders || usersOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 text-lg">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {usersOrders.map((order) => {
          const address = JSON.parse(order.shippingAddress);
          return (
            <Card key={order.id} className="border rounded-2xl shadow-sm">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Order #{order.orderNumber}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Placed on {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {order.status}
                  </Badge>
                  <Badge
                    className={`capitalize ${
                      order.paymentStatus === "paid"
                        ? "bg-green-600 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
              


                <div className="space-y-4">
                  <div className="bg-primary/9 rounded-lg p-4">
                    {order.orderItems.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start  p-3 rounded-lg"
                      >
                        <div>
                        
                          <p className="font-medium text-xs text-gray-800">
                            {item.product?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <p className="font-medium text-xs text-gray-800">₹{item.total}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">Shipping Address</h3>
                    <p className="text-sm text-gray-700">
                      {address.name}
                      <br />
                      {address.address}
                      <br />
                      📞 {address.phone}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <p>
                      <span className="font-semibold">Subtotal:</span> ₹
                      {order.subtotal}
                    </p>
                    <p>
                      <span className="font-semibold">Tax:</span> ₹{order.tax}
                    </p>
                    <p>
                      <span className="font-semibold">Discount:</span> ₹
                      {order.discount}
                    </p>
                    <p className="font-bold text-lg border-t pt-2">
                      Total: ₹{order.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
