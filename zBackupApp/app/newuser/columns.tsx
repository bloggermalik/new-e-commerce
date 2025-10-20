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

import { Edit, MoreHorizontal, Trash2, UserCheck, UserRound, UserRoundCog, UsersRound } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { useDeleteUser } from "@/app/(dashboard)/admin/newuser/useDeleteUser"
import Image from "next/image"
import { User } from "@/types/type"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export const columns=({ canUpdate, canDelete, canView,canCreate }: { canUpdate: boolean; canDelete: boolean; canView: boolean , canCreate: boolean}): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
    accessorKey: "image",
    header: () => <div className="">User</div>,
    cell: ({ row }) => {
      const image = row.getValue("image") as string | null
      const name = row.getValue("name") as string
      const email = row.getValue("email") as string
      return (
        <div className="flex py-3">
          <div className="font-medium ">
            {image ? (
              <Image
                src={image}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold"
              >
                {name ? name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </div>
          <div className="ml-2">
            <div className="flex flex-col">
              <div className="font-outfit text-gray-900 font-medium dark:text-gray-300">{name}</div>
              <div className=" font-outfit font-normal text-xs text-gray-500 dark:text-gray-400">{email}</div>
            </div>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "name",
    header: () => null,
    cell: () => null,
    enableHiding: true,
  },
  {
    accessorKey: "email",
    header: () => null,
    cell: () => null,
    enableHiding: true,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="text-xs "
    >
      Role
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>,
    cell: ({ row }) => {
    const role: "user" | "admin" | "moderator" = row.getValue("role")

    const variant =
      role === "admin"
        ? "success"   // 🟢 admin
        : role === "moderator"
        ? "warning"   // 🟡 moderator
        : role === "user"
        ? "cancel"    // 🔴 user
        : "cancel"    // 🔴 customer

    return (
      <Badge variant={variant} className="capitalize font-medium flex items-center">
        {role === "admin" && <UsersRound className="mr-1 h-4 w-4" />}
        {role === "moderator" && <UserCheck className="mr-1 h-4 w-4" />}
        {role === "user" && <UserRound className="mr-1 h-4 w-4" />}
        {role}
      </Badge>
    )
  },
  },
  {
    accessorKey: "emailVerified",
    header: () => <div className="">Email Verified</div>,
    cell: ({ row }) => {
      const emailVerified = row.getValue("emailVerified")
      return <div className="font-outfit text-gray-900 dark:text-gray-300 ">{emailVerified ? "Yes" : "No"}</div>
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
    accessorKey: "banned",
    header: () => <div className="">Banned</div>,
    cell: ({ row }) => {
      const banned = row.getValue("banned") as boolean
      return <div className="font-outfit text-gray-900 dark:text-gray-300">{banned ? "Yes" : "No"}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
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
    },
  },

]