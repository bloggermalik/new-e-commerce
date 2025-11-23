"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="container mx-auto py-10 space-y-4">
              {/* Table header skeleton */}
              <Skeleton className="h-10 w-1/4" />

              {/* Table rows skeleton */}
              <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-6 w-1/6" />
                    <Skeleton className="h-6 w-1/6" />
                    <Skeleton className="h-6 w-1/6" />
                    <Skeleton className="h-6 w-1/6" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
