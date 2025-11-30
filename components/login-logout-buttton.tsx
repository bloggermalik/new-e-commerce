import { getSession } from '@/server/user'
import React, { Suspense } from 'react'
import Link from 'next/link'
import { LogoutButton } from "./logout-button-client"
import {   User2 } from 'lucide-react'
import { Skeleton } from "./ui/skeleton"
import AvatarDropdownClient from './ui/avatar-dropdown-client'


// Skeleton component for the button
function ButtonSkeleton() {
  return (
    <Skeleton className="h-10 w-[120px]" />
  )
}

export async function LoginLogoutButton() {
  const session = await getSession()

  return (
    <Suspense fallback={<ButtonSkeleton />}>
      {session?.user ? (
        <LogoutButton />
      ) : (
        <Link href="/login" className='mr-2'>
            <User2 />
        </Link>
      )}
    </Suspense>
  )
}


export async function LoginLogoutAvatar() {
  const session = await getSession()

  console.log("My session is", session);
  

  return (
    <>
      {session &&  <AvatarDropdownClient session={session} />
      }
    </>
  )
}