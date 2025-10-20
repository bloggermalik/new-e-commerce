"use client"

import { deleteCategory } from "@/server/user"
import { Category } from "@/types/type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteCategory(id) // call server action
    },
    // 🔥 optimistic update
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] })

      const prevCategories = queryClient.getQueryData<Category[]>(["categories"])

      queryClient.setQueryData<Category[]>(["categories"], (old) =>
        old ? old.filter((u) => u.id !== id) : []
      )

      return { prevCategories }
    },

    onSuccess: () => {
      toast.success("Product deleted successfully")
    },

    // rollback if error
    onError: (_err, _id, ctx) => {
      if (ctx?.prevCategories) {
        queryClient.setQueryData(["products"], ctx.prevCategories)
      }
    },
    // ensure fresh fetch
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
