// "use client"

// import Image from "next/image"
// import { JSX } from "react"
// import { motion } from "framer-motion"
// import { useQuery } from "@tanstack/react-query"
// import { getProductBySlug } from "@/server/user"

// export default async function ProductPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>
// }): Promise<JSX.Element> {
//   const { slug } = await params

//   // Fetch product data
//   const {data: singleProduct} = useQuery({
//     queryKey: ['product', slug],
//     queryFn: async () => { await getProductBySlug(slug) },
//     staleTime: 3600 * 1000, // 1 hour
//   })


//   if (!singleProduct) return <div>Product not found</div>

//   const imageUrl = singleProduct?.variants?.[0]?.images?.[0]

//   return (
//     <div className="flex flex-col md:flex-row gap-6 p-6">
//       {/* Image Section */}
//       <div className="relative w-full md:w-1/2 aspect-square max-h-[500px] bg-gray-50 flex items-center justify-center rounded-xl">
//         {imageUrl && (
//           <motion.div
//             layoutId={`product-image-${singleProduct.id}`}
//             transition={{ duration: 0.4, ease: "easeInOut" }}
//             className="relative w-full h-full"
//           >
//             <Image
//               src={imageUrl}
//               alt={singleProduct.name}
//               fill
//               className="object-contain rounded-xl"
//               priority
//             />
//           </motion.div>
//         )}
//       </div>

//       {/* Product Details */}
//       <div className="flex flex-col justify-center w-full md:w-1/2 space-y-4">
//         <h1 className="text-3xl font-semibold">{singleProduct.name}</h1>
//         <p className="text-lg text-gray-700 font-medium">
//           ₹{singleProduct.variants?.[0]?.sellPrice ?? "N/A"}
//         </p>
//         <p className="text-gray-600">{singleProduct.description}</p>
//       </div>
//     </div>
//   )
// }


import  { getOrdersByUserId, getProductBySlug, getSession, getUserWithProfileById, } from "@/server/user";
import getQueryClient from "@/app/(dashboard)/admin/provider/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import OrderPage from "@/components/order-page";
import { Product, UserOrder } from "@/types/type";
import { SingleProductPage } from "@/components/single-product-page";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const session = await getSession();
  const userId = session?.user.id;
  const { slug } = await params;

  const queryClient = getQueryClient();
  const singleProduct = await getProductBySlug(slug);

  await queryClient.prefetchQuery({
    queryKey: ["single-product", slug],
    queryFn: () => singleProduct, // 👈 prevent refetch
  });

// console.log("My Order is ", userOrders);
// console.log("My Order is Orderitem ", userOrders[0]?.orderItems);
// console.log("My Order is Product ", userOrders[0]?.orderItems[0]?.product);


  

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SingleProductPage {...(singleProduct as Product)} />
    </HydrationBoundary>
  );
}
