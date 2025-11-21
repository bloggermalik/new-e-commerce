

import  { getOrdersByUserId, getProductBySlug, getSession, getUserWithProfileById, } from "@/server/user";
import getQueryClient from "@/app/(dashboard)/admin/provider/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import OrderPage from "@/components/order-page";
import { Product, UserOrder } from "@/types/type";
import { SingleProductPage } from "@/components/single-product-page";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const session = await getSession();
  const userId = session?.user.id;
  const { slug } = await params;

  const queryClient = getQueryClient();
  const singleProduct = await getProductBySlug(slug);

  await queryClient.prefetchQuery({
    queryKey: ["single-product", slug],
    queryFn: () => singleProduct, // 👈 prevent refetch
  });


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SingleProductPage product={singleProduct as Product} userId={userId || ""} />
    </HydrationBoundary>
  );
}
