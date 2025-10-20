"use client"

import {  type Icon } from "@tabler/icons-react"
import { usePathname } from "next/navigation" // Add this import
import {  } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { LucideIcon } from "lucide-react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon | LucideIcon
  }[]
}) {
  const pathname = usePathname() // Add this hook

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                tooltip={item.title}
                className="text-[15px] font-sans gap-3 my-1 bold font-medium
                 data-[active=true]:bg-sidebar-primary
                 data-[active=true]:text-sidebar-primary-foreground
                 data-[active=true]:hover:bg-orange-600 "
              >
                <Link href={item.url} className="flex items-center p-5
                hover:bg-sidebar-primary hover:text-sidebar-primary-foreground">
                  {item.icon && <item.icon className="!h-5 !w-5" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
