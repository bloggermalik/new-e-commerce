"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


export default function OrganizationSwitcher({ orgs }: { orgs: any[] }) {

    const [loading, setIsLoading] = useState(false);
    const { data: activeOrganization } = authClient.useActiveOrganization()

    async function handleSubmit(value?: string) {
        try {
            setIsLoading(true);
            await authClient.organization.setActive({
                organizationId: value,
            });

            toast.success("Organization switched");

        } catch (error) {
            toast.error("Failed to switch organization");

        }

        finally {
            setIsLoading(false);
        }

    }
    return (
        <div className="flex items-center">
            <Select value={activeOrganization?.id} onValueChange={handleSubmit}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                    {orgs.length === 0
                        ? (<p className='text-sm text-muted-foreground'>No organizations found.</p>)
                        : (orgs.map((org: any) => (
                            <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                        )))}

                </SelectContent>
            </Select>
            {loading && <Loader2 className="size-4 ml-2 animate-spin" />}
        </div>
    )
}