"use client";
import { UserWithProfile } from "@/types/type";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { profile } from "@/db/schema";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/server/user";
import { toast } from "sonner";


const formSchema = z.object({
    
    name: z.string().min(1).max(100),
    email: z.string().email(),
    banned: z.boolean().optional().catch(false),

    profile: z.object({
        bio: z.string().max(160).optional(),
        location: z.string().max(100).optional(),
        address: z.string().max(200).optional(),
        mobile: z.number(),
       
                    })

})

export default function UserProfile({ userWithProfile }: { userWithProfile: UserWithProfile | null }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            name: userWithProfile?.name || "",
            email: userWithProfile?.email || "",
            banned: userWithProfile?.banned || false,
          
            profile: {
                bio: userWithProfile?.profile?.bio || "",
                location: userWithProfile?.profile?.location || "",
                address: userWithProfile?.profile?.address || "",
                mobile: userWithProfile?.profile?.mobile || 0,
            }
        },
    })

    const {mutate, isPending} = useMutation({
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            const result =  await updateProfile(userWithProfile?.id || "", data);
            if (!result.success) throw new Error(result.message);
            return result;
        },
        onSuccess: () => {
            toast.success("Profile updated successfully");
        },
         onError: (err) => toast.error(err.message),

    });

    function onSubmit(data: z.infer<typeof formSchema>) {
                mutate(data);
    }
    return (
        <div className="max-w-4xl border m-auto  flex justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Whats Your name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />  <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email address" {...field} readOnly={true} />
                                </FormControl>
                             
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="banned"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Banned</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} readOnly={true} value={field.value ? "True" : "False"} />
                                </FormControl>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="profile.bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Input placeholder="What do you like?" {...field} />
                                </FormControl>
                          
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                      <FormField
                        control={form.control}
                        name="profile.location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="Location" {...field} />
                                </FormControl>
                      
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                      <FormField
                        control={form.control}
                        name="profile.address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Address" {...field} />
                                </FormControl>
                      
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                      <FormField
                        control={form.control}
                        name="profile.mobile"
                        render={({ field }) => (
                        
                            <FormItem>
                                <FormLabel>Mobile</FormLabel>
                                <FormControl>
                                    <Input {...field} onChange={(e)=>field.onChange(e.target.valueAsNumber)} type="number" placeholder="Mobile"  />
                                </FormControl>
                          
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button variant="outline" type="submit"   disabled={isPending}>
                       {isPending ? "Loading..." : "Submit"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}