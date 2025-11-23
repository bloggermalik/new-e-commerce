// InitialDataTanstack.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { DataTable } from "./data-table"
import { columns,  } from "./columns"
import { getAllOrders, getUser } from "@/server/user"
import { Loader2 } from "lucide-react"
import { AllOrder, User, UserOrder } from "@/types/type"


export default function InitialDataTanstack({ canUpdate, canDelete, canView, canCreate }: { canUpdate: boolean; canDelete: boolean; canView: boolean; canCreate: boolean; }) {
 

  const { data, isLoading, isError } = useQuery<AllOrder[]>({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    staleTime: 1000 * 60 * 5, // 5 minutes - matches server prefetch
    gcTime: 1000 * 60 * 10, // keep in memory for 10 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-red-500">Error loading users data</p>
      </div>
    )
  }

  // console.log("Prefetch data is Order", data);
  

  return <DataTable columns={columns({canCreate, canDelete, canUpdate, canView})} canCreate={canCreate} canDelete={canDelete} canUpdate={canUpdate} canView={canView} data={data ?? []} />
}
