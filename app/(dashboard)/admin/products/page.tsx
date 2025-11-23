import React from 'react'
import InitialDataTanstack from './initial-data-tanstack';
import { getProducts, getSession } from '@/server/user';
import getQueryClient from '../provider/get-query-client';
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { redirect } from 'next/navigation';
import { can } from '@/lib/auth/check-permission';
import {  Product } from '@/types/type';
export const dynamic = "force-dynamic";


export default async function page() {

  const session = await getSession();
  if (!session ) {
    redirect("/login");
  }

// Permissions
const [canCreate, canUpdate, canDelete, canView] = await Promise.all([
  can(session, { products: ["create"] }),
  can(session, { products: ["update"] }),
  can(session, { products: ["delete"] }),
  can(session, { products: ["view"] }),
])

console.log("User has permission:", { canCreate, canUpdate, canDelete, canView });
  


  const queryClient = getQueryClient()

  // Prefetch categories data on the server with proper caching configuration
  await queryClient.prefetchQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
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


