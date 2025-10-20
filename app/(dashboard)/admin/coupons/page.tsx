import React from 'react'
import InitialDataTanstack from './initial-data-tanstack';
import {  getCoupons, getSession } from '@/server/user';
import getQueryClient from '../provider/get-query-client';
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { redirect } from 'next/navigation';
import { can } from '@/lib/auth/check-permission';
import { Coupon } from '@/types/type';
export const dynamic = "force-dynamic";


export default async function page() {

  const session = await getSession();
  if (!session ) {
    redirect("/login");
  }

// Permissions
const [canCreate, canUpdate, canDelete, canView] = await Promise.all([
  can(session, { coupons: ["create"] }),
  can(session, { coupons: ["update"] }),
  can(session, { coupons: ["delete"] }),
  can(session, { coupons: ["view"] }),
])

console.log("User has permission:", { canCreate, canUpdate, canDelete, canView });


  const queryClient = getQueryClient()

  // Prefetch coupons data on the server with proper caching configuration
  await queryClient.prefetchQuery<Coupon[]>({
    queryKey: ["coupons"],
    queryFn: getCoupons,
    staleTime: 1000 * 60 * 1, // 5 minutes
    gcTime: 1000 * 60 * 1, // 10 minutes
  })

 

  console.log("User from new user page", session?.user);


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>

      <div className="p-8">

        <InitialDataTanstack canUpdate={canUpdate} canDelete={canDelete} canView={canView} canCreate={canCreate} />
      </div>
    </HydrationBoundary>
  )
}


