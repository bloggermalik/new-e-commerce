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
import {   getUserById,updateUser } from "@/server/user"
import {  useEffect, useState } from "react"
import { ArrowLeft, Loader2,  } from "lucide-react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { IconCategory2, IconClearAll } from "@tabler/icons-react"
import { Separator } from "@/components/ui/separator"
import { User } from "@/types/type"

// FORM Z SCHEMA FOR ZOD

const formSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    role: z.enum(["admin", "user", "moderator"]),
})

// MAIN FUNCTION

export default function UpdateUserForm() {
    const router = useRouter()
    const params = useParams<{ id: string }>();   // Get the id from the URL
    const id = params.id;
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false);


    //Function to Update Category using React Query
    // It triggers when user submits the form

    const mutation = useMutation({
        mutationFn: (data: z.infer<typeof formSchema>) => updateUser(id, data),
        onSuccess: (res) => {
        if (res?.success && res.user !== null && res.user !== undefined) {
            queryClient.setQueryData(["users"], (oldData: User[] | undefined) => {
            if (!oldData) return oldData;
            return oldData.map((u: User) => (u.id === res.user!.id ? res.user! : u));
            });
            toast.success(res.message);
        } else {
            toast.error(res?.message || "Update failed");
        }

        setLoading(false);
        },


        onError: (error: any) => {
            toast.error(error?.message || "Something went wrong")
            setLoading(false);
        }
    })

    // Initialize the form with React Hook Form and Zod resolver.

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "user",
        },
    })

    //  Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values);
        console.log("Form values:", values);


    }
    // Fetch category by id and prefill form
    useEffect(() => {
        async function getUserForm() {
            try {
                setLoading(true)
                const user = await getUserById(id)
                if (user) {
                    form.reset({
                        name: user.name || "",
                        email: user.email || "",
                        role: (user.role ?? "user") as "admin" | "user" | "moderator",

                        
                    })
                }
            } catch (err) {
                toast.error("Failed to load category")
            } finally {
                setLoading(false)
            }
        }

        if (id) getUserForm()
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
             
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <RadioGroup value={field.value} defaultValue="user" onValueChange={field.onChange}  >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="user" id="user" />
                                        <Label htmlFor="user">User</Label>
                                    </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="moderator" id="moderator" />
                                        <Label htmlFor="moderator">Moderator</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="admin" id="admin" />
                                        <Label htmlFor="admin">Admin</Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Separator className="" />
                <div className="flex items-center justify-center space-x-4 ">

                <Button type="submit" className="w-[100px]" disabled={mutation.isPending}>
                    {mutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        "Submit"
                    )}
                </Button>

                <Button
                    variant="outline"
                    className="w-[100px]"
                    type="button"
                    onClick={() => router.back()}
                    >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                    </Button>
                </div>
            </form>
                </Form>}
        </div>
    )
}
