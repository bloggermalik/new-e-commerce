"use server"
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import OrganizationForm from './organisation-form'
import { getOrganizations } from '@/server/organization'
import { createUser, getSession } from '@/server/user'
import OrganizationSwitcher from './organization-switcher'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { ac, customer } from '@/lib/auth/permission'
import AddUserButton from '@/components/add-user-button'


async function page() {

    const session = await getSession();

    console.log("Session from org page", session);

    if(session?.user.role === "admin") {
        console.log("User is admin");
    }

    const organisation = await getOrganizations();

    if (!organisation) {
        return <div>No organizations found.</div>;
    }

    // console.log("Organisation", organisation);

    const orgs = Array.isArray(organisation)
        ? organisation
        : (organisation as any)?.data ?? [];
     
    return (
        <div className='space-y-6'>
                <h2 className='text-xl font-semibold'>Organizations</h2>
            <OrganizationSwitcher orgs={orgs} />
            <div>

                {session?.user.role === "admin" && (
                
                   <AddUserButton />
                
                )}
             
            </div>

            
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='max-w-sm'>Create Organization</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Organization</DialogTitle>
                    </DialogHeader>
                    <OrganizationForm />
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default page
