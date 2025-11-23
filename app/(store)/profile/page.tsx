import  { getSession, getUserWithProfileById, } from "@/server/user";
import getQueryClient from "@/app/(dashboard)/admin/provider/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import UserProfile from "@/components/user-profile";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getSession();
  const userId = session?.user.id;

  const queryClient = getQueryClient();
  const userWithProfile = await getUserWithProfileById(userId!);

  await queryClient.prefetchQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => userWithProfile, // 👈 prevent refetch
  });

  console.log("My profile is", userWithProfile);
  

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfile userWithProfile={userWithProfile} />
    </HydrationBoundary>
  );
}
