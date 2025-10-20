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
import { Category, Product } from "@/types/type"
import { useDeleteProduct } from "./useDeleteProduct"
import Link from "next/link"
import { toast } from "sonner"
import { can } from "@/lib/auth/check-permission"
import { Badge } from "@/components/ui/badge"





export const columns = (
  { canUpdate, canDelete, canView, canCreate }: { canUpdate: boolean; canDelete: boolean; canView: boolean; canCreate: boolean }
): ColumnDef<Product>[] => [
    {
      id: "select",
      size: 40, // 👈 narrow fixed width
      maxSize: 40,
      minSize: 40,
      header: ({ table }) => (
        <div className="flex justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },


    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const product = row.original;

        // ✅ Safe optional chaining at every step
        const image = product.variants?.[0]?.images?.[0] ?? null;
        const costPrice = product.variants?.[0]?.costPrice ?? null;
        const sellPrice = product.variants?.[0]?.sellPrice ?? null;
        const stock = product.variants?.[0]?.stock ?? null;


        return (
          <div className="text-gray-900 font-sans font-medium dark:text-gray-300 flex items-center space-x-8">
            {image ? (
              <Image
                src={image}
                alt={product.name}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
            ) : null}
            <div className="flex flex-col space-y-3 border-l pl-4">
              <p>{product.name}</p>
              <p>{(costPrice !== null && sellPrice !== null) && (
                <Badge className="line-through bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  ₹{costPrice}
                </Badge>
              )}
                {(costPrice !== null && sellPrice !== null) && (
                  <Badge className="ml-1 text-sm bg-green-100 text-gray-800 dark:bg-green-800 dark:text-gray-200">
                    ₹{sellPrice}
                  </Badge>
                )}</p>
              <div className="flex flex-col space-y-1">
                {stock !== null && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Stock: {stock}
                  </span>
                )}

              </div>
            </div>

          </div>
        );
      },

    },
    {
      accessorKey: "price",
      header: () => <div className="">Price</div>,
      cell: ({ row }) => {
        const product = row.original;

        // ✅ Safe optional chaining and fallback
        const prices = product.variants?.map(v => v.sellPrice) ?? [];

        // ✅ Handle empty or missing variant prices
        if (prices.length === 0) {
          return (
            <div className="font-sans font-medium text-gray-500 dark:text-gray-400">
              N/A
            </div>
          );
        }

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        return (
          <div className="font-sans font-medium text-gray-600 dark:text-gray-300">
            {minPrice === maxPrice
              ? `₹${minPrice.toFixed(2)}`
              : `₹${minPrice.toFixed(2)} - ₹${maxPrice.toFixed(2)}`}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: () => <div className="">Category</div>,
      cell: ({ row }) => {
        const product = row.original;

        // ✅ Safe optional chaining and fallback
        const categoryName = product.category?.name ?? "Uncategorized";
        return (<>
          <div className="font-sans font-medium text-gray-600 dark:text-gray-300">
            {categoryName}
          </div>
        </>)

      },
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
        console.log("Row createdAt:", createdAt) // 👀 debug

        if (!createdAt) return <div className="font-medium">N/A</div>

        const date = new Date(createdAt) // convert ISO string → Date object
        return (
          <div className="font-medium font-sans text-gray-500 dark:text-gray-300">
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
        const product = row.original
        const { mutate: deleteProduct, isPending } = useDeleteProduct()

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
                  <Link href={`/products/${product.id}`} className="flex items-center w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit product
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
                      Delete product
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete{" "}
                        <span className="font-semibold">{product.name}</span>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteProduct(product.id)}
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