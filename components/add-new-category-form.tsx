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
import { createCategory } from "@/server/user"
import { useState } from "react"
import { Loader2, Trash2, UploadCloudIcon } from "lucide-react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadToImageKit } from "./image-kit-upload"
import Image from "next/image"



const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    slug: z.string().min(2, { message: "Slug must be at least 2 characters." }),
    description: z.string().max(500, { message: "Description must be at most 500 characters." }),
    image: z
        .object({
            url: z.string().url(),
            fileId: z.string(),
        })
        .nullable()
        .optional(),
    isActive: z.boolean().catch(true),
})


export default function AddNewCategoryForm() {
     const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (data: z.infer<typeof formSchema>) =>
            createCategory({
                ...data,
                image: data.image ?? null, // ✅ store full JSON {url, fileId} or null
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Category created successfully")
            form.reset();
        },
        onError: (error) => {
            toast.error(error?.message || "Something went wrong")
        }
    })

  
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

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values);
        console.log("Form values:", values);


    }
    return (
        <div className="space-y-4">
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

                    {/* IMAGES */}
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => {
                           

                            const handleUpload = async () => {
                                if (!files.length) return;

                                const uploadingToast = toast.loading("Uploading images...");
                                setIsUploading(true);

                                try {
                                    for (const file of files) {
                                        const res = await uploadToImageKit(file);
                                        if (res.url && res.fileId)
                                            field.onChange({ url: res.url, fileId: res.fileId });

                                    }

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
                         const handleDelete = async () => {
                            if (!field.value) return;
                            const deletingToast = toast.loading("Deleting image...");

                            try {
                                const res = await fetch("/api/delete-image", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ fileId: field.value.fileId }),
                                });

                                const data = await res.json();
                                if (!res.ok) throw new Error(data.error || "Delete failed");

                                field.onChange(null);
                                toast.success("Image deleted!");
                            } catch (error) {
                                console.error(error);
                                toast.error("Delete failed!");
                            } finally {
                                toast.dismiss(deletingToast);
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
                                                id="file-upload"
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
                                                htmlFor="file-upload"
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
                                            {field.value?.url && (
                                                <div className="w-full mt-4 flex flex-wrap gap-3 justify-center">
                                                    <div className="relative">
                                                        {/* Trash Icon */}
                                                        <button
                                                        type="button"
                                                        onClick={handleDelete}
                                                        className="absolute top-1 right-0 p-1 bg-red-600 rounded-full hover:bg-red-700"
                                                        >
                                                        <Trash2 className="h-4 w-4 text-white" />
                                                        </button>

                                                        {/* Image */}
                                                        <Image
                                                        width={50}
                                                        height={50}
                                                        src={field.value.url  }
                                                        alt="uploaded"
                                                        className="h-24 w-24 object-cover rounded-md" // reduced size
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
