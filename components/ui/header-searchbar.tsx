import { Search } from "lucide-react";
import { Input } from "./input";

export default function HeaderSearchbar() {

    return (
        <div className="relative w-full md:w-1/3 mx-6 md:mx-20">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-5 text-sm rounded-3xl shadow-sm
               border border-input  focus:ring-primary bg-background text-foreground
               placeholder:text-muted-foreground placeholder:font-normal placeholder:text-gray-400
               dark:bg-background dark:text-foreground dark:border-input"
               
            />
        </div>


    )
}