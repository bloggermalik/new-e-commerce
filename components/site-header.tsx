import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "./mode-toggle"
import HeaderSearchbar from "./ui/header-searchbar"
import CartIcon from "./ui/cart-icon"
import { LoginLogoutAvatar, LoginLogoutButton } from "./login-logout-buttton"
import { getSession } from "@/server/user"

export async function SiteHeader() {

  const session = await getSession();


  return (
    <header className=" bg-background-header flex h-18 md:h-20 shrink-0 items-center border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center ">
      
       
        
        <h1 className="text-lg md:ml-16 mx-auto font-logo  font-medium">Lenzoa.com</h1>

        <HeaderSearchbar className="hidden md:block"  />
        <div className=" flex items-center gap-2">
         <div className="hidden md:block">
         <ModeToggle/>
         </div>
         <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 hidden md:flex"
        />
        {!session && <LoginLogoutButton />}

        <LoginLogoutAvatar />
         <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4 hidden md:flex"
        />
        <CartIcon />
      </div>
    </div>
    </header>
  )
}
