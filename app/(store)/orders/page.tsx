import  { getOrdersByUserId, getSession, getUserWithProfileById, } from "@/server/user";
import getQueryClient from "@/app/(dashboard)/admin/provider/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import UserProfile from "@/components/user-profile";
import OrderPage from "@/components/order-page";
import { UserOrder } from "@/types/type";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getSession();
  const userId = session?.user.id;

  const queryClient = getQueryClient();
  const userOrders = await getOrdersByUserId(userId!);

  await queryClient.prefetchQuery({
    queryKey: ["user-orders", userId],
    queryFn: () => userOrders, // 👈 prevent refetch
  });

console.log("My Order is ", userOrders);
console.log("My Order is Orderitem ", userOrders[0]?.orderItems);
console.log("My Order is Product ", userOrders[0]?.orderItems[0]?.product);


  

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderPage usersOrders={userOrders as UserOrder[]} />
    </HydrationBoundary>
  );
}
