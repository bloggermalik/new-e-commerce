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
import {   getCouponById,  updateCoupon } from "@/server/user"
import {  useEffect, useState } from "react"
import { ChevronDownIcon, Loader2, StepBack, } from "lucide-react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { IconCategory2,} from "@tabler/icons-react"
import { Separator } from "@/components/ui/separator"
import { User } from "@/types/type"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

// FORM Z SCHEMA FOR ZOD

const formSchema = z.object({
    code: z.string().min(2).max(50),
    discountType: z.enum(["percent", "flat"]),
    discountValue: z.number().min(1),
    expiry: z.date(),
    isActive: z.boolean().optional(),
    usageLimit: z.number().min(1).optional(),
    usedCount: z.number().min(0).optional(),
})

// MAIN FUNCTION

export default function UpdateCouponForm() {
    const router = useRouter()
    const params = useParams<{ id: string }>();   // Get the id from the URL
    const id = params.id;
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false);


    //Function to Update Category using React Query
    // It triggers when user submits the form

    const mutation = useMutation({
        mutationFn: (data: z.infer<typeof formSchema>) => updateCoupon(id, data),
        onSuccess: (res) => {
        if (res?.success && res.coupon !== null && res.coupon !== undefined) {
            queryClient.setQueryData(["coupons"], (oldData: User[] | undefined) => {
            if (!oldData) return oldData;
            return oldData.map((u: User) => (u.id === res.coupon!.id ? res.coupon! : u));
            });
            toast.success(res.message);
           
        } else {
            toast.error(res?.message || "Update failed");
        }

        setLoading(false);
        },


        onError: (error: Error) => {
            toast.error(error?.message || "Something went wrong")
            setLoading(false);
        }
    })

    // Initialize the form with React Hook Form and Zod resolver.

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            discountType: "percent",
            discountValue: 1,
            expiry: new Date(),
            isActive: true,
            usageLimit: 1,
            usedCount: 0,
        },
    })

    //  Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values);
        console.log("Form values:", values);


    }
    // Fetch category by id and prefill form
    useEffect(() => {
        async function getCouponForm() {
            try {
                setLoading(true)
                const coupon = await getCouponById(id)
                if (coupon) {
                   form.reset({
                       code: coupon.code || "",
                       discountType: coupon.discountType || "percent",
                       discountValue: coupon.discountValue || 1,
                       expiry: coupon.expiry || new Date(),
                       isActive: coupon.isActive || true,
                       usageLimit: coupon.usageLimit || 1,
                       usedCount: coupon.usedCount || 0,
                    });
                }
            } catch (error) {
                toast.error("Failed to load category",error)
            } finally {
                setLoading(false)
            }
        }

        if (id) getCouponForm()
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
                        Please fill in the form to update Coupon.</p>
                    <Separator className="my-6" />
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Code</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Code of coupon"
                                        {...field}
                                        value={field.value?.toUpperCase() || ""}
                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="discountType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discount Type</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        value={field.value || "percent"} // default to "percent"
                                        onValueChange={field.onChange} // already string
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="flat" id="flat" />
                                            <Label htmlFor="flat">Flat</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="percent" id="percent" />
                                            <Label htmlFor="percent">Percent</Label>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="discountValue"
                        render={({ field }) => {
                            const discountType = form.watch("discountType"); // ✅ declare outside JSX

                            return (
                                <FormItem>
                                    <FormLabel>Discount Value</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="Value of discount"
                                                {...field}
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className="pr-10"
                                                type="number" // forces numeric input
                                            />
                                           <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {discountType === "percent" ? "%" : "₹"}
                                            </span>

                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
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
                    <FormField
                        control={form.control}
                        name="expiry"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Expiry</FormLabel>
                                <FormControl>
                                    <div className="flex flex-col gap-3">


                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    id="date"
                                                    className="w-48 justify-between font-normal"
                                                >
                                                    {field.value
                                                        ? new Date(field.value).toLocaleDateString()
                                                        : "Select date"}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent
                                                className="w-auto overflow-hidden p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    captionLayout="dropdown"
                                                    onSelect={(date) => {
                                                        field.onChange(date); // ✅ update form state
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="usageLimit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>No of times you want this coupon to be used</FormLabel>
                                <FormControl>
                                     <Input
                                        placeholder="Usage limit"
                                        {...field}
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="pr-10"
                                        type="number" // forces numeric input
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="usedCount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>How many times this coupon has been used</FormLabel>
                                <FormControl>
                                    <Input placeholder="Usage limit" {...field} readOnly />
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
                  <Button variant="outline" onClick={() => router.back()}>
                        <StepBack className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </Form>}
        </div>
    )
}
