import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground bg-background dark:bg-gray-800 dark:text-foreground placeholder:text-muted-foreground selection:bg-gray-600 selection:text-primary-foreground  border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "border border-red-200 focus:border-[var(--sidebar-primary)] focus:!ring-0 focus:!outline-none focus:!ring-offset-0 dark:focus:border-[var(--sidebar-primary)] dark:border-border font-sans placeholder:font-light placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
      ,
      className
    )}
      {...props}
    />
  )
}

export { Input }
