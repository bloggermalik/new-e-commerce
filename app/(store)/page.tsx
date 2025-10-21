// import { Button } from '@/components/ui/button';
// import { getProducts } from '@/server/user'
// import Image from 'next/image';
// import React from 'react'
// export const dynamic = "force-dynamic";


// async function page() {

//   const products = await getProducts()
//   console.log("Products are", products[0].variants);
//   return (
//     <div className="flex justify-center p-3">
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6 justify-items-center">
//         {products.map((product) => {
//         // Discount calculation
//         const sellPrice = product.variants[0].sellPrice
//         const costPrice = product.variants[0].costPrice
//         const discount = costPrice > 0 ? ((costPrice - sellPrice) / costPrice) * 100 : 0;  
//         return (
       
//             <div key={product.id} className="bg-white shadow-md p-4 flex flex-col items-center justify-center text-lg font-semibold rounded-lg w-full max-w-[250px]" >
//               <div>
//               {/* Product Image */}
//                 <div className="w-full aspect-square flex items-center justify-center overflow-hidden rounded-md bg-gray-50">
//                   {product.variants[0].images[0] ? (
//                     <Image
//                       key={product.id}
//                       src={product.variants[0].images[0]}
//                       alt={product.name}
//                       width={200}
//                       height={200}
//                       className="object-contain w-full h-full"
//                     />
//                   ) : (
//                     <div className="text-gray-400 text-sm">No Image</div>
//                   )}
//                 </div>
//               {/* Product Name */}
//                 <span className="text-sm px-2 mt-4 block max-w-[180px] overflow-hidden whitespace-nowrap text-ellipsis">
//                   {product.name}
//                 </span>
//                 {/* Sell Price     */}
//                 <span className="text-green-500 text-md px-2">
//                   ₹{product.variants[0].sellPrice}
//                 </span>
//                {/* Cost price and  Discount */}
//                <div className="flex space-x-1 items-center px-2">
//                 <span className="text-gray-500 text-sm line-through">
//                   ₹{product.variants[0].costPrice}
//                 </span>
//                 <span className="text-green-500 text-sm">
//                   {discount.toFixed(2)}% OFF
//                 </span>
//                 </div>
//                 {/* Add to cart button */}
//                 <div className='px-2'>
//                   <Button className="mt-4">+ Add</Button>
//                 </div>  
//               </div>
//             </div>
          
//         )}
//       )
//     }
//       </div>
//     </div>



//   )
// }

// export default page


import { Button } from "@/components/ui/button";
import { getProducts } from "@/server/user";
import Image from "next/image";
import React from "react";

export const dynamic = "force-dynamic";

async function page() {
  const products = await getProducts();

  return (
    <div className="flex justify-center p-3">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center w-full">
        {products.map((product) => {
          // Discount calculation
          const sellPrice = product.variants[0]?.sellPrice ?? 0;
          const costPrice = product.variants[0]?.costPrice ?? 0;
          const discount =
            costPrice > 0 ? ((costPrice - sellPrice) / costPrice) * 100 : 0;

          return (
            <div
              key={product.id}
              className="bg-white shadow-md p-4 flex flex-col items-center text-lg font-semibold rounded-lg w-full max-w-[250px] hover:shadow-lg transition"
            >
              {/* Product Image */}
              <div className="w-full aspect-square flex items-center justify-center overflow-hidden rounded-md bg-gray-50">
                {product.variants[0]?.images?.[0] ? (
                  <Image
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

              {/* Product Info */}
              <div className="w-full mt-4 px-2 text-left">
                {/* Product Name */}
                <p
                  className="text-sm font-medium text-gray-800 truncate"
                  title={product.name} // Tooltip for full name on hover
                >
                  {product.name}
                </p>

                {/* Sell Price */}
                <p className="text-green-600 text-md font-semibold">
                  ₹{sellPrice}
                </p>

                {/* Cost price & Discount */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm line-through">
                    ₹{costPrice}
                  </span>
                  {discount > 0 && (
                    <span className="text-green-500 text-xs font-medium">
                      {discount.toFixed(0)}% OFF
                    </span>
                  )}
                </div>

                {/* Add Button */}
                <Button className="mt-3 w-full text-sm font-medium">
                  + Add
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default page;
