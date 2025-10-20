// InitialDataTanstack.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { getCategory, getProducts, getUser } from "@/server/user"
import { Loader2 } from "lucide-react"
import { Category, Product } from "@/types/type"

async function fetchCategories() { 
  return await getCategory() 
}

export default function InitialDataTanstack({ canUpdate, canDelete, canView, canCreate }: { canUpdate: boolean; canDelete: boolean; canView: boolean; canCreate: boolean }) {
  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,   
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
        <p className="text-red-500">Error loading Product data</p>
      </div>
    )
  }

  return <DataTable columns={columns({canUpdate, canDelete, canView, canCreate})} canUpdate={canUpdate} canDelete={canDelete} canView={canView} canCreate={canCreate} data={data ?? []} />
}
