import React from 'react'
import InitialDataTanstack from './initial-data-tanstack';
import { getCategory, getSession } from '@/server/user';
import getQueryClient from '../provider/get-query-client';
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { redirect } from 'next/navigation';
import { can } from '@/lib/auth/check-permission';
import { Category } from '@/types/type';
export const dynamic = "force-dynamic";


export default async function page() {

  const session = await getSession();
  if (!session ) {
    redirect("/login");
  }

//Message fetch from Cookies


// Permissions
const [canCreate, canUpdate, canDelete, canView] = await Promise.all([
  can(session, { categories: ["create"] }),
  can(session, { categories: ["update"] }),
  can(session, { categories: ["delete"] }),
  can(session, { categories: ["view"] }),
])
console.log("User has permission:", { canCreate, canUpdate, canDelete, canView });


  const queryClient = getQueryClient()

  // Prefetch categories data on the server with proper caching configuration
  await queryClient.prefetchQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategory,
    staleTime: 1000 * 60 * 1, // 5 minutes
    gcTime: 1000 * 60 * 1, // 10 minutes
  })

 

  console.log("User from new user page", session?.user);


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>

      <div className="p-8 font-outfit">
      
        <InitialDataTanstack  canUpdate={canUpdate} canDelete={canDelete} canView={canView} />
      </div>
    </HydrationBoundary>
  )
}


