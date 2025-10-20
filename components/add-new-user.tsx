"use client"
import React from 'react'
import { Button } from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import AddNewUserForm from './add-new-user-form'
import { Separator } from './ui/separator'
import {  UserPlus } from 'lucide-react'


function AddNewUser() {
    return (
        <div className='max-w-sm absolute'>

            <Dialog>
                <DialogTrigger asChild>

                    <Button variant={'secondary'} className='
                     p-4
                    h-11
                    text-gray-700
                    font-outfit
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
                    '>
                    <UserPlus className=" h-6 w-6" />
                    Add New User</Button>

                </DialogTrigger>
                <DialogContent>
                    <DialogHeader className='space-y-4'>
                        <DialogTitle>Please Fill all the details</DialogTitle>
                        <Separator />
                        <DialogDescription asChild>
                            <AddNewUserForm />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>

    )
}

export default AddNewUser
