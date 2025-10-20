"use client"

import { deleteProduct } from "@/server/user"
import {  Product } from "@/types/type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteProduct(id) // call server action
    },
    // 🔥 optimistic update
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["products"] })

      const prevProducts = queryClient.getQueryData<Product[]>(["products"])

      queryClient.setQueryData<Product[]>(["products"], (old) =>
        old ? old.filter((u) => u.id !== id) : []
      )

      return { prevProducts }
    },

    onSuccess: () => {
      toast.success("Product deleted successfully")
    },

    // rollback if error
    onError: (_err, _id, ctx) => {
      if (ctx?.prevProducts) {
        queryClient.setQueryData(["products"], ctx.prevProducts)
      }
    },
    // ensure fresh fetch
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
