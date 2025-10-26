'use client';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { ChevronDown, Logs, MessageSquareMore, User, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { LogoutButton } from '../logout-button-client';
import { Session } from '@/types/type';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from './separator';



export default function AvatarDropdownClient({ session }: { session: Session }) {
  console.log("My session is", JSON.stringify(session));
  console.log("My session is", session);

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <div className="group flex items-center cursor-pointer gap-2 !ml-0 mr-2 md:mr-2">
          <Avatar className='w-10 h-10'>
            <AvatarImage src={session?.user.image ?? undefined} />
            <AvatarFallback>{session?.user.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 !transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="animate-slide-up-fade rounded-4xl border bg-background p-2 shadow-md w-[300px] max-w-lg "
      >
        <div className='flex flex-col items-center space-y-3 px-2  border-b '>
          <span className='text-md font-medium'>{session?.user.email}</span>
          {session?.user?.image ? (
            <Image
              width={64}
              height={64}
              src={session.user.image}
              alt={session.user.name ?? "User"}
              className="mt-3 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 mt-4 rounded-full bg-gray-200 flex items-center justify-center text-xl text-gray-500">
              {session?.user?.name?.[0] || "U"}
            </div>
          )}
          <span className='font-medium text-lg '>{session?.user?.name}</span>
          {session?.user?.role === 'admin' && <span className='text-xs text-muted-foreground capitalize -mt-4 '>Role: {session?.user?.role}</span>}
          <Separator className='my-3' />
          <Link href="/profile" className='max-w-xl w-[220px] cursor-pointer '>
            <DropdownMenuItem asChild>
              <Button variant="outline" size="sm" className='w-full  h-11  cursor-pointer rounded-full
              hover:border-primary ring-0 focus:ring-0 focus:ring-offset-0 
              focus-visible:ring-0 focus-visible:ring-offset-0
              hover:translate-x-0.5  !transition-all duration-300 ease-in-out'>
                <User className='mr-3' />
                View Profile
              </Button>
            </DropdownMenuItem>
          </Link>
          <Link href="/profile" className='max-w-xl w-[220px] cursor-pointer hidden md:block'>
            <DropdownMenuItem asChild>
              <Button variant="outline" size="sm" className='w-full  h-11  
                focus-visible:ring-0 focus-visible:ring-offset-0

              cursor-pointer rounded-full
            hover:border-primary hover:translate-x-0.5  !transition-all duration-300 ease-in-out'>
                <Logs className='mr-3' />
                My Orders
              </Button>
            </DropdownMenuItem>
          </Link>
          <Link href="/profile" className='max-w-xl w-[220px]  cursor-pointer mb-3'>
            <DropdownMenuItem asChild>
              <Button variant="outline" size="sm" className='w-full border  h-11  
                            focus-visible:ring-0 focus-visible:ring-offset-0

              cursor-pointer rounded-full
            hover:border-primary hover:translate-x-0.5 !transition-all duration-300 ease-in-out'>
                <MessageSquareMore className='mr-3' />
                My Comments
              </Button>
            </DropdownMenuItem>
          </Link>
          {((session?.user?.role === 'admin') || (session?.user?.role === 'moderator')) && (
            <Link href="/admin" className='max-w-xl w-[220px]  cursor-pointer mb-3'>
              <DropdownMenuItem asChild>
                <Button variant="outline" size="sm" className='w-full border  h-11  cursor-pointer rounded-full
            hover:border-primary hover:translate-x-0.5 !transition-all duration-300 ease-in-out'>
                  <Users className='mr-3' />
                  Admin Dashboard
                </Button>
              </DropdownMenuItem>
            </Link>
          )}
        </div>
        <DropdownMenuItem asChild >
          <LogoutButton className="focus:bg-red-600 focus:text-white my-6 mx-auto w-[200px]  h-11  cursor-pointer rounded-full" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
