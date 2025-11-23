"use client"
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from "next/navigation";

export default function AddProductButton() {

    const router = useRouter();
  return (
    <div>
      <Button onClick={() => {router.push('/products/add')}}>Add Products</Button>
    </div>
  )
}


