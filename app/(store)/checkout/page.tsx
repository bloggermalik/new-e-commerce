import getProfileByUserId, { getCart, getSession } from '@/server/user';
import getQueryClient from "@/app/(dashboard)/admin/provider/get-query-client"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import CartPage from '@/components/ui/cart-page';
import { user } from '@/auth-schema';

export const dynamic = "force-dynamic";


export default async function page() {

  const session = await getSession();
  const userId = session?.user.id;
  const queryClient = getQueryClient()

  // Prefetch categories data on the server with proper caching configuration
  await queryClient.prefetchQuery({
    queryKey: ["profile"],
    queryFn: () => getProfileByUserId(userId!),
     staleTime: 0, // always fetch fresh
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>

      <div >
        <CartPage />
     
      </div>
    </HydrationBoundary>
  )
}


