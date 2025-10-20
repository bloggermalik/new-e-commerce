"use client"

import { deleteCoupon } from "@/server/user"
import {  Coupon } from "@/types/type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useDeleteCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteCoupon(id) // call server action
    },
    // 🔥 optimistic update
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["coupons"] })

      const prevCoupon = queryClient.getQueryData<Coupon[]>(["coupons"])

      queryClient.setQueryData<Coupon[]>(["coupons"], (old) =>
        old ? old.filter((u) => u.id !== id) : []
      )

      return { prevCoupon }
    },

    onSuccess: () => {
      toast.success("Coupon deleted successfully")
    },

    // rollback if error
    onError: (_err, _id, ctx) => {
      if (ctx?.prevCoupon) {
        queryClient.setQueryData(["coupons"], ctx.prevCoupon)
      }
    },
    // ensure fresh fetch
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] })
    },
  })
}
