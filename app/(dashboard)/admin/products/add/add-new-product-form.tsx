"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray, UseFormReturn, FieldErrors } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChipsTag } from "@/components/chips-tag"
import { DollarSign, Package, Plus, Settings, Tags, FileText, ListChecks, Trash, UploadCloudIcon, Loader2, } from "lucide-react"
import { useState } from "react"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { uploadToImageKit } from "@/components/image-kit-upload"
import { toast } from "sonner"
import { createProduct } from "@/server/user"
import { Category } from "@/types/type"
import AddNewCategory from "@/components/add-new-category"
import Image from "next/image"





// Form schema that matches the database fields
const formSchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().min(2),
    isActive: z.boolean().catch(true),
    categoryId: z.string().min(1), // changed
    tags: z.array(z.string()).optional(),
    variants: z.array(
        z.object({
            sellPrice: z.number(),
            costPrice: z.number(),
            stock: z.number(),
            isActive: z.boolean().catch(true),
            images: z.array(z.string()), // always required, no .default([]) here
            productId: z.string().optional(),
            attributes: z.array(z.object({ name: z.string(), value: z.string() })).optional(),
        })
    ).optional(),
})


type ProductFormValues = z.infer<typeof formSchema>;
function VariantEditor({ index, form, removeVariant }: { index: number; form: UseFormReturn<ProductFormValues>; removeVariant: (idx: number) => void }) {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const { control } = form
    const { fields: attributeFields, append: appendAttribute, remove: removeAttribute } = useFieldArray({
        control,
        name: `variants.${index}.attributes`,
    })

    return (
        <Card className="bg-muted/10 border border-border/40">
            <CardHeader className="flex flex-row justify-between items-center py-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-primary" /> Variant {index + 1}
                </CardTitle>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(index)}
                    className="text-destructive hover:bg-destructive/10"
                >
                    Remove
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Price & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <FormField
                        control={form.control}
                        name={`variants.${index}.costPrice`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cost Price</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                            placeholder="0.00"
                                            className="pl-10"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`variants.${index}.sellPrice`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sell Price</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                            placeholder="0.00"
                                            className="pl-10"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={`variants.${index}.stock`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                            placeholder="0"
                                            className="pl-10"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name={`variants.${index}.isActive`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Variant Status</FormLabel>
                                <Select
                                    onValueChange={(val) => field.onChange(val === "true")}
                                    defaultValue={field.value ? "true" : "false"}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="true" className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                                            Active
                                        </SelectItem>
                                        <SelectItem value="false" className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-gray-400 inline-block"></span>
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Images */}
                <FormField
                    control={form.control}
                    name={`variants.${index}.images`}
                    render={({ field }) => {


                        const handleUpload = async () => {
                            if (!files.length) return;

                            const uploadingToast = toast.loading("Uploading images...");
                            setIsUploading(true);

                            try {
                                const uploadedUrls: string[] = [];

                                for (const file of files) {
                                    const res = await uploadToImageKit(file);
                                    if (res.url) uploadedUrls.push(res.url);
                                }

                                // append new uploads to existing images
                                field.onChange([...(field.value || []), ...uploadedUrls]);

                                toast.success("Images uploaded successfully!");
                                setFiles([]); // clear file selection
                            } catch (error) {
                                console.error(error);
                                toast.error("Image upload failed!");
                            } finally {
                                toast.dismiss(uploadingToast);
                                setIsUploading(false);
                            }
                        };

                        return (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 bg-background flex flex-col items-center gap-4 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <UploadCloudIcon />
                                            <p className="text-sm text-muted-foreground">
                                                Drag & drop your images here, or
                                            </p>
                                        </div>
                                        {/* Hidden File Input */}
                                        <input
                                            id={`file-upload-${index}`}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (!e.target.files) return;
                                                setFiles(Array.from(e.target.files));
                                            }}
                                        />

                                        {/* Custom Choose Button */}
                                        <label
                                            htmlFor={`file-upload-${index}`}
                                            className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                        >
                                            Choose Files
                                        </label>

                                        {/* Upload Button */}
                                        <button
                                            type="button"
                                            onClick={handleUpload}
                                            disabled={isUploading || !files.length}
                                            className={`px-6 py-2 rounded-lg font-medium text-white transition ${isUploading || !files.length
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-700"
                                                }`}
                                        >
                                            {isUploading ? "Uploading..." : "Upload"}
                                        </button>

                                        {/* ✅ Show already uploaded images */}
                                        {(field.value?.length ?? 0) > 0 && (
                                            <div className="w-full mt-4 flex flex-wrap gap-3 justify-center">
                                                {(field.value ?? []).map((url: string, i: number) => (
                                                    <div
                                                        key={i}
                                                        className="w-24 h-24 rounded-md overflow-hidden border border-muted-foreground/20 relative"
                                                    >
                                                        <Image
                                                            width={50}
                                                            height={50}
                                                            src={url}
                                                            alt={`uploaded-${i}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />

                {/* Attributes */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="flex items-center gap-2 text-sm font-semibold">
                            <Settings className="h-4 w-4 text-primary" /> Attributes
                        </h4>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => appendAttribute({ name: "", value: "" })}
                        >
                            <Plus className="h-4 w-4 mr-1" /> Add Attribute
                        </Button>
                    </div>

                    {attributeFields.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No attributes yet</p>
                    ) : (
                        <div className="grid gap-4">
                            {attributeFields.map((attr, attributeIndex) => (
                                <div key={attr.id} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`variants.${index}.attributes.${attributeIndex}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Attribute Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Color" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`variants.${index}.attributes.${attributeIndex}.value`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Attribute Value</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Red" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        className="mt-6"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => removeAttribute(attributeIndex)}
                                    >
                                        <Trash className="h-4 w-4 mr-1" /> Remove Attribute
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default function AddNewProductForm({ categories }: { categories: Category[] }) {

    // const [categories, setCategories] = useState<Category[]>([]);


    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", slug: "", description: "", isActive: true, categoryId: "", tags: [], variants: [] },
    })

    const { control } = form
    const { fields: variantFields, append, remove } = useFieldArray({ control, name: "variants" })

    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            setLoading(true)
            console.log("🚀 Form submitted successfully!")
            console.log("📝 Form values:", values)
            await createProduct(values);
            // You can add your API call here
            // Example: await createProduct(values)

            // Show success message
            alert("Product submitted successfully! Check console for values.")
        } catch (error) {
            console.error("Error submitting form:", error)
        }
        setLoading(false)
        console.log("✅ Form is valid:", true)



    }

    function onError(error: FieldErrors<ProductFormValues>) {
        console.log("❌ Form validation errors:", error)
        console.log("🔍 Form state:", form.formState)
    }

    //  useEffect(() => {
    //         async function fetchCategories() {
    //             try {
    //                 const category = await getCategory();
    //                 setCategories(category);
    //             } catch (error) {
    //                 toast.error("Failed to load categories: " + getErrorMessage(error));
    //             }
    //         }
    //         fetchCategories();
    //     }, []);

    return (
        <div className="p-6 space-y-6 max-w-4xl w-full mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
                    {/* Product Info */}
                    <Card >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <FileText className="h-5 w-5 text-primary" /> Product Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid space-y-4 gap-6 md:grid-cols-2">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel className="text-muted-foreground">Name</FormLabel><FormControl><Input {...field}

                                    placeholder="Product Name"
                                /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name="slug" render={({ field }) => (
                                <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem className="md:col-span-2"><FormLabel>Description</FormLabel><FormControl>

                                    <SimpleEditor value={field.value} onChange={field.onChange} />


                                </FormControl></FormItem>
                            )} />
                            <Separator className="md:col-span-2" />
                            <div className="flex items-end gap-4">

                                <FormField control={form.control} name="isActive" render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Product Status</FormLabel>
                                        <Select onValueChange={(val) => field.onChange(val === "true")} defaultValue={field.value ? "true" : "false"}>
                                            <FormControl>
                                                <SelectTrigger className=""
                                                >
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                <SelectItem value="true" className="flex items-center gap-2">
                                                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                                                    Active
                                                </SelectItem>
                                                <SelectItem value="false" className="flex items-center gap-2">
                                                    <span className="w-3 h-3 rounded-full bg-gray-400 inline-block"></span>
                                                    Inactive
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                    </FormItem>
                                )} />
                                {/* Category Select */}
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category.id} value={category.id}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                            </div>
                            <FormField control={form.control} name="tags" render={({ field }) => (
                                <FormItem className="md:col-span-2 ">
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl><ChipsTag value={field.value ?? []} onChange={field.onChange} /></FormControl>
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* Variants */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <Tags className="h-5 w-5 text-primary" /> Variants
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {variantFields.map((variant, index) => (
                                <VariantEditor key={variant.id} index={index} form={form} removeVariant={remove} />
                            ))}
                            <Button type="button" onClick={() => append({ costPrice: 0, sellPrice: 0, stock: 0, isActive: true, images: [], productId: "", attributes: [] })}>
                                <Plus className="h-4 w-4 mr-1" /> Add Variant
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                console.log("🔍 Current form values:", form.getValues())
                                console.log("📊 Form state:", form.formState)
                                console.log("✅ Is valid:", form.formState.isValid)
                                console.log("❌ Errors:", form.formState.errors)
                            }}
                        >
                            Debug Form Values
                        </Button>
                        <Button type="submit" className=" max-w-sm" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
