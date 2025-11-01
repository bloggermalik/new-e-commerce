import getProfileByUserId, { getCart, getSession } from '@/server/user';
import getQueryClient from "@/app/(dashboard)/admin/provider/get-query-client"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import CartPage from '@/components/ui/cart-page';
import { Alert, Button } from '@mui/material';
import Person2Icon from '@mui/icons-material/Person2';

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

if(profileData?.mobile === "" || profileData?.address === "") {
  return (
    <div className="space-y-4 flex flex-col h-[50vh] items-center justify-center text-center text-red-500">
      <Alert severity="warning">Please update your profile before checkout.</Alert>
       <Button  href='/profile' variant="contained" endIcon={<Person2Icon />}>
        Update Profile
      </Button>
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

