import { getCart } from '@/server/user';
import getQueryClient from "@/app/(dashboard)/admin/provider/get-query-client"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import CartPage from '@/components/ui/cart-page';
import CheckOutPage from '@/components/checkout-page';

export const dynamic = "force-dynamic";


export default async function page() {

  const queryClient = getQueryClient()

  // Prefetch categories data on the server with proper caching configuration
  await queryClient.prefetchQuery({
    queryKey: ["cart"],
    queryFn: getCart,
     staleTime: 0, // always fetch fresh
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>

      <div >
        <CheckOutPage />
     
      </div>
    </HydrationBoundary>
  )
}


