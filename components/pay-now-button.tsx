"use client";

import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PaymentIcon from "@mui/icons-material/Payment";
import { toast } from "sonner";
import { Loader } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ShippingAddress {
  name?: string;
  address?: string;
  phone?: string;
}

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

interface PayNowButtonProps {
  userId: string;
  cartData: CartItem[];
  shippingAddress: ShippingAddress;
}

export default function PayNowButton({
  userId,
  cartData,
  shippingAddress,
}: PayNowButtonProps) {
  const [loading, setLoading] = useState(false);

  async function loadRazorpayScript() {
    if (window.Razorpay) return true;
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handlePayNow() {
    if (!cartData.length) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Create Razorpay order on your server
      const { data } = await axios.post("/api/razorpay/create-order", {
        userId,
        items: cartData,
        shippingAddress,
        phone: shippingAddress.phone,
      });

      if (!data.ok) throw new Error(data.error || "Failed to create order");

      const { key, razorpayOrderId, localOrderId, amount, currency } = data;

      // 2️⃣ Load Razorpay checkout script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load Razorpay SDK");
        return;
      }

      // 3️⃣ Configure Razorpay checkout options
      const options = {
        key,
        amount,
        currency,
        name: "Lenzoa",
        description: "Order Payment",
        order_id: razorpayOrderId,
        prefill: {
          name: shippingAddress?.name,
          contact: shippingAddress?.phone,
        },
        notes: { localOrderId },
        theme: { color: "#2563eb" },
        handler: async function (response: any) {
          // 4️⃣ Verify payment on your server
          try {
            const verify = await axios.post("/api/razorpay/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              localOrderId,
            });

            if (verify.data.ok) {
              toast.loading("Payment successful! Please wait");
              window.location.href = `/orders`;
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error("Verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
          },
        },
      };

      // 5️⃣ Open Razorpay popup
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handlePayNow}
      className=" w-[130px]  text-sm font-semibold border-primary 
                            text-white  bg-primary hover:bg-white hover:text-primary transition-colors"
                            variant="outline"
      disabled={loading}
    >
      {loading ? <Loader className=" h-4 w-4 animate-spin" />: "Pay Now"}
      <PaymentIcon className="ml-2 !transition-colors duration-200" />
    </Button>
  );
}
