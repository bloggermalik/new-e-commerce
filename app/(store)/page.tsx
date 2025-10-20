import { Button } from '@/components/ui/button';
import { getProducts } from '@/server/user'
import Image from 'next/image';
import React from 'react'

async function page() {

  const products = await getProducts()
  console.log("Products are", products[0].variants);

  const sellPrice = products[0].variants[0].sellPrice
  const costPrice = products[0].variants[0].costPrice
  const discount =
  costPrice > 0 ? ((costPrice - sellPrice) / costPrice) * 100 : 0;
  return (
    <div className="flex justify-center p-3">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6 justify-items-center">
        {products.map((product) => {
        // Discount calculation
        const sellPrice = product.variants[0].sellPrice
        const costPrice = product.variants[0].costPrice
        const discount =
        costPrice > 0 ? ((costPrice - sellPrice) / costPrice) * 100 : 0;  
        return (
          <div key={product.id}>
            <div key={product.id} className="bg-white shadow-md p-4 w-[200px]  flex items-center justify-center text-lg font-semibold rounded-lg">
              <div>
              {/* Product Image */}
                <div className="w-[200px] h-[200px] p-1 flex items-center justify-center overflow-hidden rounded-md ">
                  {product.variants[0].images[0] ? (
                    <Image
                      key={product.id}
                      src={product.variants[0].images[0]}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">No Image</div>
                  )}
                </div>
              {/* Product Name */}
                <span className="text-sm px-2 mt-4 block max-w-[180px] overflow-hidden whitespace-nowrap text-ellipsis">
                  {product.name}
                </span>
                {/* Sell Price     */}
                <span className="text-green-500 text-md px-2">
                  ₹{product.variants[0].sellPrice}
                </span>
               {/* Cost price and  Discount */}
               <div className="flex space-x-1 items-center px-2">
                <span className="text-gray-500 text-sm line-through">
                  ₹{product.variants[0].costPrice}
                </span>
                <span className="text-green-500 text-sm">
                  {discount.toFixed(2)}% OFF
                </span>
                </div>
                {/* Add to cart button */}
                <div className='px-2'>
                  <Button className="mt-4">+ Add</Button>
                </div>  
              </div>
            </div>
          </div>
        )}
      )
    }
      </div>
    </div>



  )
}

export default page
