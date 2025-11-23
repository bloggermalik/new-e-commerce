"use client"
import * as React from "react"

import {
  ColumnDef,
  flexRender,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,

  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AddNewCoupon from "@/components/add-new-coupon"
import { ListFilterPlus, Search } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  canUpdate?: boolean
  canDelete?: boolean
  canView?: boolean
  canCreate?: boolean

}

export function DataTable<TData, TValue>({
  columns,
  data,
  canUpdate,
  canDelete,
  canView,
  canCreate
}: DataTableProps<TData, TValue>) {

  console.log("create update and delete is", canUpdate, canView, canDelete);
  
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const [rowSelection, setRowSelection] = React.useState({})


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,


    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },

  })



  return (
    <div className="space-y-4 mt-4 font-outfit">
        {canCreate && (
        <AddNewCoupon />
      )}
      <div className="flex justify-end space-x-2">
        <div>
          <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Filter coupon"
          value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("code")?.setFilterValue(event.target.value)
          }
          className="max-w-sm shadow-sm text-gray-800 sm:w-[300px]  w-full rounded-lg border border-input bg-background px-10 py-5 text-sm text-foreground placeholder:text-muted-foreground placeholder:font-normal placeholder:font-outfit placeholder:text-gray-400"
        />
      </div>
        </div>
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="outline" className="
                                p-4
                                h-11
                                text-gray-700
                                font-sans
                                bg-white
                                border
                                border-sidebar-primary
                                shadow-md
                                rounded-sm
                                hover:bg-sidebar-primary
                                hover:text-white
                                dark:bg-gray-900
                                dark:text-white
                                dark:border-gray-800
                                dark:hover:bg-gray-800
                      ">
              <ListFilterPlus />
              Filter
            </Button>
          </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter(
              (column) => column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    
      <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1  text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>

  )
}