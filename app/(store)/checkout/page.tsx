import getProfileByUserId, { getCart, getSession } from '@/server/user';
import getQueryClient from "@/app/(dashboard)/admin/provider/get-query-client"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import CartPage from '@/components/ui/cart-page';
import { Alert, } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = "force-dynamic";


export default async function page() {

  const session = await getSession();
  const userId = session?.user.id;
  const queryClient = getQueryClient()

  // Prefetch categories data on the server with proper caching configuration
  const [profileData, cartData] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: ["profile", userId],
      queryFn: () => getProfileByUserId(userId!),
      staleTime: 0,
    }),
    queryClient.fetchQuery({
      queryKey: ["cart", userId],
      queryFn: () => getCart(),
      staleTime: 0,
    }),
  ]);

  console.log("Profile data:", profileData);
  console.log("Cart data:", cartData);

  if (profileData?.mobile === "" || profileData?.address === "") {
    return (
      <div className="space-y-4 mt-40 p-8 max-w-[600px] mx-auto flex flex-col  text-center text-red-500">
        <Alert severity="warning">Please update your profile first.</Alert>

        <div className="flex justify-end w-full">
          <Link href="/profile">
            <Button
              variant="outline"
              color="outline"
              className="w-[160px]  text-sm font-semibold border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors"
            >
              Update Profile
              <EastIcon className="" />

            </Button>
          </Link>
        </div>
      </div>

    );
  }


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>

      <div >
        <CartPage />

      </div>
    </HydrationBoundary>
  )
}

