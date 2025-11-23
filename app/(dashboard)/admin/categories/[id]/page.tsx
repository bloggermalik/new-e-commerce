"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {  getCategoryById, updateCategory } from "@/server/user"
import {  useEffect, useState } from "react"
import { Loader2, Save, StepBack, Trash2, UploadCloudIcon } from "lucide-react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { IconCategory2, IconClearAll } from "@tabler/icons-react"
import { Separator } from "@/components/ui/separator"
import { uploadToImageKit } from "@/components/image-kit-upload"
import Link from "next/link"
import Error from "next/error"
import { getErrorMessage } from "@/components/ui/get-error-message"
import Image from "next/image"

// FORM Z SCHEMA FOR ZOD

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    slug: z.string().min(2, { message: "Slug must be at least 2 characters." }),
    description: z.string().max(500, { message: "Description must be at most 500 characters." }),
    image: z.object({
        url: z.string().url(),
        fileId: z.string(),
    }).nullable().optional(),
    isActive: z.boolean().catch(true),
})

// MAIN FUNCTION

export default function UpdateCategoryForm() {
    const params = useParams<{ id: string }>();   // Get the id from the URL
    const id = params.id;
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);


    //Function to Update Category using React Query
    // It triggers when user submits the form

    const mutation = useMutation({
        mutationFn: (data: z.infer<typeof formSchema>) => updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Category updated successfully")
            setLoading(false);
            form.reset();
        },
        onError: (error) => {
            toast.error(error?.message || "Something went wrong")
            setLoading(false);
        }
    })

    // Initialize the form with React Hook Form and Zod resolver.

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            image: null,
            isActive: true,
        },
    })

    //  Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values);
        console.log("Form values:", values);


    }
    // Fetch category by id and prefill form
    useEffect(() => {
        async function fetchCategory() {
            try {
                setLoading(true)
                const category = await getCategoryById(id)
                if (category) {
                    form.reset({
                        name: category.name || "",
                        slug: category.slug || "",
                        description: category.description || "",
                         image: category.image
                            ? {
                                url: category.image?.url || "",
                                fileId: category.image?.fileId || "",
                            }
                            : null,

                        isActive: category.isActive ?? true,
                    })
                }
            } catch (error) {
                const message = getErrorMessage(error)
                toast.error(message || "Failed to load category")
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchCategory()
    }, [id, form])
    return (
        <div className="space-y-4 p-4  rounded-md w-full max-w-lg mx-auto">
            {/* Show loader when loading categories */}

            {loading && <div className="flex justify-center items-center ">
                <Loader2 className="h-6 w-6 animate-spin mt-32" />
            </div>}

            {/* Show form when not loading */}

            {!loading &&
                <Form {...form} >
                    <p className="text-lg text-muted-foreground  my-6">
                        <IconCategory2 className="inline mr-2" />
                        Please fill in the form to update category.</p>
                    <Separator className="my-6" />
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        {/* Name formfield */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name of category" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Slug formfield */}
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="slug-of-category" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Description formfield */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Description of category" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Is Active formfield */}
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Is Active</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            value={field.value ? "true" : "false"} // boolean -> string
                                            onValueChange={(val) => field.onChange(val === "true")} // string -> boolean
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="true" id="true" />
                                                <Label htmlFor="true">True</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="false" id="false" />
                                                <Label htmlFor="false">False</Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Images */}

                        <FormField
                            control={form.control}
                            name="image"
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
                                            field.onChange({ url: res.url, fileId: res.fileId }); // ✅ store object
                                        }

                                        toast.success("Image uploaded successfully!");
                                        setFiles([]);
                                    } catch (error) {
                                        console.error(error);
                                        toast.error("Image upload failed!");
                                    } finally {
                                        toast.dismiss(uploadingToast);
                                        setIsUploading(false);
                                    }
                                };

                                const handleDelete = async () => {
                                    if (!field.value?.fileId) return;

                                    const deletingToast = toast.loading("Deleting image...");
                                    setLoading(true);

                                    try {
                                        const res = await fetch("/api/delete-image", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ fileId: field.value.fileId }),
                                        });

                                        if (!res.ok) {
                                            const data = await res.json();
                                            throw new Error(data.error || "Delete failed");
                                        }

                                        toast.success("Image deleted successfully!");
                                        field.onChange(null); 
                                        } 
                                        catch (error) {
                                            console.error(error);
                                            const message = getErrorMessage(error);
                                            toast.error(message || "Delete failed");
                                        } finally {
                                        toast.dismiss(deletingToast);
                                        setLoading(false);
                                    }
                                };


                                return (
                                    <FormItem>
                                        <FormLabel>Image</FormLabel>
                                        <FormControl>
                                            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 bg-background flex flex-col items-center gap-4 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <UploadCloudIcon />
                                                    <p className="text-sm text-muted-foreground">
                                                        Drag & drop your image here, or
                                                    </p>
                                                </div>

                                                <input
                                                    id="file-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        if (!e.target.files) return;
                                                        setFiles(Array.from(e.target.files));
                                                    }}
                                                />

                                                <label
                                                    htmlFor="file-upload"
                                                    className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                                >
                                                    Choose File
                                                </label>

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

                                                {field.value && (
                                                    <div className="relative group mt-4">
                                                        {/* Trash Icon — appears on hover */}
                                                        
                                                        <button
                                                            type="button"
                                                            onClick={handleDelete}
                                                            className="absolute top-1 left-1 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-white" />
                                                        </button>

                                                        <Image
                                                            height={30}
                                                            width={30}
                                                            src={field.value.url}
                                                            alt="uploaded"
                                                            className="h-24 w-24 object-cover rounded-md border"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />


                        <div className="flex gap-3">
                            {/* Submit button */}
                            <Button type="submit" disabled={mutation.isPending} className="w-28">
                                {mutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                ) : (<> <Save className="mr-2 h-4 w-4" /> Save </>)}
                            </Button>

                            {/* Reset button */}
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-28"
                                onClick={() =>
                                    form.reset({
                                        name: "",
                                        slug: "",
                                        description: "",
                                        image: null,
                                        isActive: true,
                                    })
                                }
                            > <IconClearAll />
                                Clear
                            </Button>

                            {/* Go Back button */}
                            <Link href="/admin/categories">
                                <Button variant="outline" className="w-28">
                                    <StepBack />
                                    Go Back
                                </Button>
                            </Link>
                        </div>


                    </form>

                </Form>}
        </div>
    )
}
