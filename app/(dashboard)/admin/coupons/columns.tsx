"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/alert-dialog"

import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { Coupon } from "@/types/type"
import { useDeleteCoupon } from "./useDeleteCoupon"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"


export const columns = (
  { canUpdate, canDelete, canView, canCreate }: { canUpdate: boolean; canDelete: boolean; canView: boolean; canCreate: boolean }
): ColumnDef<Coupon>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => {
        const code = row.getValue("code") as string
        return <div className="font-medium font-outfit text-sm capitalize">{code}</div>
      }
    },
    {
      accessorKey: "discountValue",
      header: "Discount Value",
      cell: ({ row }) => {
        const discountValue = row.getValue("discountValue") as number
        const type = row.getValue("discountType") as string
        if (type === "flat") {
          return <div className="font-medium font-outfit text-sm capitalize">₹{discountValue}</div>
        }
        return <div className="font-medium font-outfit text-sm capitalize">{discountValue}%</div>
      }
    },
    {
      accessorKey: "discountType",
      header: "Discount Type",
      cell: ({ row }) => {
        const discountType = row.getValue("discountType") as string
        return <div className="text-gray-800 dark:text-gray-400  font-outfit text-sm capitalize">{discountType}</div>
      }
    },

    {
      accessorKey: "isActive",
      header: ({ column }) => <Button
        variant="ghost"
        className="text-xs"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>,
      cell: ({ row }) => {
        const isActive: boolean = row.getValue("isActive")

        const variant = isActive ? "success" : "cancel"

        return (
          <Badge
            variant={variant}
            className="capitalize font-sans font-medium flex items-center"
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        )
      },

    },




    {
      accessorKey: "createdAt",
      header: ({ column }) => <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <div className="text-xs">Created At</div>
        <ArrowUpDown className="ml-2 h-4 w-4" />

      </Button>,
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string | null
        const expiry = row.getValue("expiry") as string | null

        if (!createdAt) return <div className="font-medium">N/A</div>
        if (!expiry) return <div className="font-medium">N/A</div>


        const date = new Date(createdAt)


        return (
          <div className="font-medium">
            {date.toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </div>
        )
      },

    },
    {
      accessorKey: "expiry",
      header: ({ column }) => <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <div className="text-xs">Expired At</div>
        <ArrowUpDown className="ml-2 h-4 w-4" />

      </Button>,
      cell: ({ row }) => {
        const createdAt = row.getValue("expiry") as string | null

        if (!createdAt) return <div className="font-medium">N/A</div>

        const date = new Date(createdAt) // convert ISO string → Date object
        return (
          <div className="font-medium">
            {date.toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </div>
        )
      },

    },


    {
      id: "actions",
      cell: ({ row }) => {
        const coupon = row.original
        return (
          <CouponActions
            coupon={coupon}
            canUpdate={canUpdate}
            canDelete={canDelete}
          />)


      },
    },

  ]

function CouponActions({ coupon, canUpdate, canDelete }: { coupon: Coupon; canUpdate: boolean; canDelete: boolean }) {
  const { mutate: deleteCoupon, isPending } = useDeleteCoupon();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {canUpdate && (
          <DropdownMenuItem asChild>
            <Link href={`/coupons/${coupon.id}`} className="flex items-center w-full">
              <Edit className="mr-2 h-4 w-4" />
              Edit Coupon
            </Link>
          </DropdownMenuItem>
        )
        }

        {/* ✅ Wrap delete in AlertDialog */}
        {canDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="text-red-500 focus:text-red-600"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete coupon
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete{" "}
                  <span className="font-semibold">{coupon.code}</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteCoupon(coupon.id)}
                  disabled={isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isPending ? "Deleting..." : "Confirm"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

      </DropdownMenuContent>
    </DropdownMenu>

  )
}
