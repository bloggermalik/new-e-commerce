import { getCategory } from "@/server/user";
import AddNewProductForm from "./add-new-product-form";
export const dynamic = "force-dynamic";



export default async function AddProduct() {

    const categories = await getCategory();
    return (
       <AddNewProductForm categories={categories} />
    )
}