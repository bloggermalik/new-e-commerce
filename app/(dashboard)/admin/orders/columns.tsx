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

import { Edit, MoreHorizontal, Trash2, UserCheck, UserRound, UsersRound } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { useDeleteUser } from "@/app/(dashboard)/admin/newuser/useDeleteUser"
import Image from "next/image"
import { AllOrder, User } from "@/types/type"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUserById, updateOrderStatus } from "@/server/user"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const columns=({ canUpdate, canDelete, canView,canCreate }: { canUpdate: boolean; canDelete: boolean; canView: boolean , canCreate: boolean}): ColumnDef<AllOrder>[] => {
  console.log("canView and canCreate", canView, canCreate);


  
  return[
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
    accessorKey: "orderNumber",
    header: ({ column }) => "Order Number",
    cell: ({ row }) => {
      const orderNumber = row.getValue<string>("orderNumber")
      return <div className="text-xs">{orderNumber}</div>
    },
  },
 {
  accessorKey: "user",
  header: "Customer",
  cell: ({ row }) => {
    const user = row.original?.user //

    return (
      <div className="flex items-center gap-2 text-xs">

        <div>
          <div className="font-medium">{user?.name || "Unknown"}</div>
          <div className="text-gray-500">{user?.email || "N/A"}</div>
        </div>
      </div>
    )
  },
},
  {
    accessorKey: "subtotal",
    header: () => "Total Amount",
    cell: ({row}) => {
      const subtotal = row.original.subtotal;
      return <div className="text-xs font-medium">{subtotal}</div>
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="text-xs "
    >
      Payment Status
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>,
    cell: ({ row }) => {
    const paymentStatus: "pending" | "paid" | "falied" | "refunded" = row.getValue("paymentStatus")

    const variant =
      paymentStatus === "paid"
        ? "success"   // 🟢 admin
        : paymentStatus === "pending"
        ? "warning"   // 🟡 moderator
        : paymentStatus === "falied"
        ? "cancel"    // 🔴 user
        : "cancel"    // 🔴 customer

    return (
      <Badge variant={variant} className="capitalize font-medium flex items-center">
        {paymentStatus === "paid" && <UsersRound className="mr-1 h-4 w-4" />}
        {paymentStatus === "pending" && <UserCheck className="mr-1 h-4 w-4" />}
        {paymentStatus === "falied" && <UserRound className="mr-1 h-4 w-4" />}
        {paymentStatus}
      </Badge>
    )
  },
  },
{
    accessorKey: "status",
    header: () => <div className="text-sm font-semibold">Dispatch Status</div>,
    cell: ({ row }) => {
      const queryClient = useQueryClient()
      const currentStatus = row.getValue("status") as "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned"
      const paymentStatus = row.getValue("paymentStatus") as "pending" | "paid" | "failed" | "refunded"
      const orderId = row.original.id

      const mutation = useMutation({
        mutationFn: async (newStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned") =>
          await updateOrderStatus(orderId, newStatus),
        onSuccess: () => {
          toast.success("Order status updated!")
          queryClient.invalidateQueries({ queryKey: ["orders"] })
        },
        onError: () => toast.error("Failed to update status"),
      })

      if( paymentStatus === "pending") {
        return (
          <Badge variant="warning" className="capitalize font-medium flex items-center text-xs">
            Payment Pending
          </Badge>
        )
      }

      return (
        <Select
          defaultValue={currentStatus}
          onValueChange={(value) =>
            mutation.mutate(
              value as
                | "pending"
                | "processing"
                | "shipped"
                | "delivered"
                | "cancelled"
                | "returned"
            )
          }
        >
          <SelectTrigger className="w-[140px] text-xs">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {["pending","processing","shipped","delivered","cancelled","returned"].map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
  },
  {
    accessorKey: "quantity",
    header: () => <div className="">Items Qty</div>,
    cell: ({ row }) => {
      const quantity = row.original?.orderItems.reduce((acc, item) => acc + item.quantity, 0);
      return <div className="font-medium text-xs">{quantity}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="text-xs"
    >
      <div className="">Created At</div>
      <ArrowUpDown className="ml-2 h-4 w-4" />

    </Button>,
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string | null
      console.log("Row createdAt:", createdAt) // 👀 debug

      if (!createdAt) return <div className="font-medium">N/A</div>

      const date = new Date(createdAt) // convert ISO string → Date object
      return (
        <div className="text-gray-900 dark:text-gray-300">
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
      const user = row.original
      return (
        <div className="">
          {/* <DeleteUser user={user} canDelete={canDelete} canUpdate={canUpdate}/> */}
        </div>)
     
    },
  },

]}

function DeleteUser({ user, canDelete, canUpdate }: { user: User; canDelete: boolean; canUpdate: boolean }) {
   const { mutate: deleteUser, isPending } = useDeleteUser()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
           {(canDelete || canUpdate) && <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

           {canUpdate &&<DropdownMenuItem asChild>
              <Link href={`/newuser/${user.id}`} className="flex items-center w-full">

              <Edit className="mr-2 h-4 w-4" />
              Edit customer
              </Link>
            </DropdownMenuItem> }

            {/* ✅ Wrap delete in AlertDialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
               {canDelete && <DropdownMenuItem
                  className="text-red-500 focus:text-red-600"
                  onSelect={(e) => e.preventDefault()} // 👈 stops dropdown from auto-closing
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete customer
                </DropdownMenuItem> }
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete{" "}
                    <span className="font-semibold">{user.name}</span>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteUser(user.id)}
                    disabled={isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isPending ? "Deleting..." : "Confirm"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>

      )
}