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
import Image from "next/image"
import { Category } from "@/types/type"
import { useDeleteCategory } from "./useDeleteCategory"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"





export const columns = (
  { canUpdate, canDelete, canView }: { canUpdate: boolean; canDelete: boolean; canView: boolean }
): ColumnDef<Category>[] => [
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
      accessorKey: "image",
      header: () => <div className="">Image</div>,
      cell: ({ row }) => {
        const image = row.getValue("image") as { url: string; fileId: string } | null
        return (
          <div className="font-medium">
            {image ? (
              <Image
                src={image?.url}
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              "N/A"
            )}
          </div>
        )
      }
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        return <div className="font-outfit text-gray-900 font-medium dark:text-gray-300">{name}  </div>
      }
    },

    {
      accessorKey: "isActive",
      header: ({ column }) =>
        <Button
          className="text-xs "
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>,
      cell: ({ row }) => {
        const isActive = row.getValue("isActive")
        console.log("Row isActive:", isActive) // 👀 debug
        return <div className="pl-3">
          <Badge className="" variant={isActive ? "success" : "cancel"}
          >{isActive ? "Active" : "Inactive"}</Badge> </div>
      },
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) =>
        <Button
          className="text-xs"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
          <div className="font-medium pl-3 text-gray-500">
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
        const category = row.original
        const { mutate: deleteCategory, isPending } = useDeleteCategory()

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
                  <Link href={`/admin/categories/${category.id}`} className="flex items-center w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit category
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
                      Delete category
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete{" "}
                        <span className="font-semibold">{category.name}</span>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteCategory(category.id)}
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
      },
    },

  ]