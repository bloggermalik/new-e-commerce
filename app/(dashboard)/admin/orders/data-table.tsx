//data-table
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
import AddNewUser from "@/components/add-new-user"
import { ListFilterPlus, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  canUpdate, canDelete, canView, canCreate
}: DataTableProps<TData, TValue>) {
  console.log("canUpdate canDelete canView", canUpdate, canView, canDelete);

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const [rowSelection, setRowSelection] = React.useState({})
    const [selectedStatus, setSelectedStatus] = React.useState("")


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
    enableRowSelection: true,


  })

  const selectedRows = table.getFilteredSelectedRowModel().rows    

 return (
  <div className="space-y-4 mt-4">
 <Select
        onValueChange={(value) => {
          setSelectedStatus(value)
          table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="shipped">Shipped</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
          <SelectItem value="returned">Returned</SelectItem>
        </SelectContent>
      </Select>


    {/* Top Controls */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      {/* Left Section (Search + Delete) */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
        

        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="w-full shadow-sm text-gray-800 font-outfit rounded-lg border border-input bg-background px-10 py-5 text-sm text-foreground placeholder:text-muted-foreground placeholder:font-normal placeholder:font-outfit placeholder:text-gray-400"
          />
        </div>
        {selectedRows.length > 0 && (
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
          >
            Delete
          </Button>
        )}
      </div>

      {/* Right Section (Filter Dropdown) */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 p-4 h-11 text-gray-700 font-outfit bg-white border border-sidebar-primary shadow-md rounded-md hover:bg-sidebar-primary hover:text-white dark:bg-gray-900 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800"
            >
              <ListFilterPlus className="h-5 w-5" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    {/* Table */}
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
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

    {/* Pagination */}
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 py-4">
      <div className="text-muted-foreground text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <div className="flex space-x-2">
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
  </div>
)

}