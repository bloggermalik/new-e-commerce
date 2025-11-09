import React from 'react'
import InitialDataTanstack from './initial-data-tanstack';
import { getAllOrders, getSession } from '@/server/user';
import getQueryClient from '../provider/get-query-client';
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { redirect } from 'next/navigation';
import { can } from '@/lib/auth/check-permission';
export const dynamic = "force-dynamic";


export default async function page() {
  const session = await getSession();
  if (!session ) {
    redirect("/login");
  }
   
const [canCreate, canUpdate, canDelete, canView] = await Promise.all([
  can(session, { order: ["create"] }),
  can(session, { order: ["update"] }),
  can(session, { order: ["delete"] }),
  can(session, { order: ["view"] }),
])

// console.log("User has permission:", { canCreate, canUpdate, canDelete, canView });

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })

  const order = await getAllOrders();

  console.log("Prefetched Orders Data", order);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="p-8">
        <InitialDataTanstack  canUpdate={canUpdate} canDelete={canDelete} canView={canView} canCreate={canCreate} />
      </div>
    </HydrationBoundary>
  )
}


