"use client"

import { deleteUser } from "@/server/user"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteUser(id) // call server action
    },
    // 🔥 optimistic update
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["users"] })

      const prevUsers = queryClient.getQueryData<any[]>(["users"])

      queryClient.setQueryData<any[]>(["users"], (old) =>
        old ? old.filter((u) => u.id !== id) : []
      )

      return { prevUsers }
    },

    onSuccess: (result) => {
      if(!result.success) return toast.error(result.message)
      toast.success("User deleted successfully")
    },

    // rollback if error
    onError: (_err, _id, ctx) => {
      if (ctx?.prevUsers) {
        queryClient.setQueryData(["users"], ctx.prevUsers)
      }
    },
    // ensure fresh fetch
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
