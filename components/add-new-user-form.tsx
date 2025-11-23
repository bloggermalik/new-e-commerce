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
import { createUser } from "@/server/user"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"



const formSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(50),
    role: z.enum(["admin", "user", "moderator"]),
})


export default function AddNewUserForm() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (data: z.infer<typeof formSchema>) => createUser(data),
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.message || "Something went wrong")
                return;
            }
            toast.success("User created successfully")
            queryClient.invalidateQueries({ queryKey: ["users"] })
            form.reset();
        },
        onError: (error: Error) => {
            toast.error(error?.message || "Something went wrong")
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "user",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("The form value submitted is", values);
        mutation.mutate(values);
        

    }
    return (
        <Form {...form}>
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
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Password" {...field} />
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

                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        "Submit"
                    )}
                </Button>
            </form>
        </Form>
    )
}
