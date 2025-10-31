import { Loader2 } from "lucide-react";



export default function LoadingUI() {

return (
  <div className="flex justify-center h-screen">
    <Loader2 className="h-10 mt-40 w-10 animate-spin stroke-current text-blue-500" />
  </div>
);
}