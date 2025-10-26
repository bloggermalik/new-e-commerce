import getProfileByUserId, { getSession, } from "@/server/user";
import getQueryClient from "@/app/(dashboard)/admin/provider/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import UserProfile from "@/components/user-profile";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getSession();
  const userId = session?.user.id;

  const queryClient = getQueryClient();
  const profile = await getProfileByUserId(userId!);

  await queryClient.prefetchQuery({
    queryKey: ["profile", userId],
    queryFn: () => profile, // 👈 prevent refetch
  });

  console.log("My profile is", profile);
  

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProfile profile={profile} />
    </HydrationBoundary>
  );
}
