"use client";
import { UserWithProfile } from "@/types/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import TextField from '@mui/material/TextField';
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/server/user";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import SaveIcon from '@mui/icons-material/Save';


const formSchema = z.object({

    name: z.string().min(1).max(100),
    email: z.string().email(),
    banned: z.boolean().optional().catch(false),

    profile: z.object({
        bio: z.string().max(160).optional(),
        location: z.string().max(100).optional(),
        address: z.string().max(200).optional(),
        mobile: z.string(),

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
                mobile: userWithProfile?.profile?.mobile || "",
            }
        },
    })

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            const result = await updateProfile(userWithProfile?.id || "", data);
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
    return (<>
        <div className=" py-8 justify-center items-center flex flex-col">
            <h1 className="font-bold text-xl">
                {(() => {
                    const name = (userWithProfile?.name ?? "").toWellFormed().trim();
                    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                })()}
            </h1>
            <p className="text-gray-500 text-xs">Update your profile information below:</p>
        </div>

        <div className="max-w-4xl m-auto  flex justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    {/* <Input placeholder="Whats Your name" {...field} /> */}
                                    <TextField
                                        {...field}
                                        id="outlined-basic"
                                        size="small"
                                        label="Name"
                                        variant="outlined"
                                        value={field.value === null ? "" : field.value}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />  <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <TextField
                                    
                                        {...field}
                                        id="outlined-basic"
                                        size="small"
                                        label="Email"
                                        slotProps={{
                                            input: { readOnly: true, className: "!text-gray-400" }
                                        }}
                                        variant="outlined"
                                        value={field.value === null ? "" : field.value}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);

                                        }}
                                        
                                    />
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
                                <FormControl>
                                    {/* <Input placeholder="shadcn" {...field} readOnly={true} value={field.value ? "True" : "False"} /> */}

                                    <TextField
                                        {...field}
                                        id="outlined-basic"
                                        size="small"
                                        label="Is Banned"
                                        variant="outlined"
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                                className: "!text-gray-400",
                                            },
                                        }}
                                        value={field.value === true ? "Yes" : "No"}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                    />
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
                                <FormControl>
                                    <TextField
                                        {...field}
                                        id="outlined-basic"
                                        size="small"
                                        label="About You?"
                                        variant="outlined"
                                        value={field.value === null ? "" : field.value}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                    />
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
                                <FormControl>
                                    <TextField
                                        {...field}
                                        id="outlined-basic"
                                        size="small"
                                        label="Location"
                                        variant="outlined"
                                        value={field.value === null ? "" : field.value}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                    />
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
                                <FormControl>
                                    {/* <Input placeholder="Address" {...field} /> */}
                                    <TextField id="outlined-basic" size="small" label="Address" variant="outlined" {...field} />

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
                                <FormControl>
                                    {/* <Input {...field} onChange={(e)=>field.onChange(e.target.valueAsNumber)} type="number" placeholder="Mobile"  /> */}
                                    <TextField
                                        {...field}
                                        id="outlined-basic"
                                        type="number"
                                        size="small"
                                        label="Mobile"
                                        variant="outlined"
                                        value={field.value === null ? "" : field.value}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                        }}
                                    />

                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button variant="outline" type="submit" disabled={isPending}
                          className=" w-[130px]  text-sm font-semibold border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors"
>
                        {isPending ? <Loader2  className="animate-spin !text-blue-800"/> : "Save Profile"}
                       {isPending=== false && <SaveIcon  fontSize="small"/> }
                    </Button>
                </form>
            </Form>

        </div>
    </>)
}