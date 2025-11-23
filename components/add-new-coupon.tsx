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
import AddNewCouponForm from './add-new-coupon-form'
import { LucideArrowBigDownDash } from 'lucide-react'


export default function AddNewCoupon() {
    return (
        <div>

            <Dialog>
                <DialogTrigger asChild>

                    <Button variant={'secondary'} className=' max-w-sm absolute
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
                    dark:hover:bg-gray-800'>
                     <LucideArrowBigDownDash />
                     Add New Coupon</Button>

                </DialogTrigger>
                <DialogContent>
                    <DialogHeader className='space-y-4'>
                        <DialogTitle>Please Fill all the details</DialogTitle>
                        <DialogDescription asChild>
                            <AddNewCouponForm />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>

    )
}
