import {  Profile } from "@/types/type";

export interface CartItem {
  id: string
  productId: string
  quantity: number
  price: number
  sellPrice?: number   // ✅ optional
  name: string
  description: string
  image: string[]
}


export default function CartCheckOut({ profileData, cartData }: { profileData: Profile; cartData: CartItem[] }) {
    return (
        <div className=" flex md:flex-row flex-col md:min-h-[100svh] overflow-hidden">
            <div className="md:w-1/2 bg-gray-100">
                <h1>Cart Check Out 1</h1>
            </div>
            <div className=" md:w/2">
                <h1>Cart Check Out 2</h1>
            </div>

        </div>
    );
}