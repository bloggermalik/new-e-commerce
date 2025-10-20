import React from 'react'
import InitialDataTanstack from './initial-data-tanstack';
import { getSession, getUser } from '@/server/user';
import getQueryClient from '../provider/get-query-client';
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { redirect } from 'next/navigation';
import { can } from '@/lib/auth/check-permission';

export default async function page() {
  const session = await getSession();
  if (!session ) {
    redirect("/login");
  }
   
const [canCreate, canUpdate, canDelete, canView] = await Promise.all([
  can(session, { users: ["create"] }),
  can(session, { users: ["update"] }),
  can(session, { users: ["delete"] }),
  can(session, { users: ["view"] }),
])

console.log("User has permission:", { canCreate, canUpdate, canDelete, canView });

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: getUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })

  console.log("Session User", session?.user);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="p-8">
        <InitialDataTanstack  canUpdate={canUpdate} canDelete={canDelete} canView={canView} canCreate={canCreate} />
      </div>
    </HydrationBoundary>
  )
}


