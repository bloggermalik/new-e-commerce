"use client";

import { use, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Star } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, getProductById } from "@/server/user";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

type ReviewDialogProps = {
  orderId: string;
  productId: string;
  userId: string;
  name: string;
  children: React.ReactNode; // will wrap "Write a Review"
};

export default function ReviewDialog({ name, orderId, productId, userId, children }: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);

    const queryClient = useQueryClient();

  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: async () => {
      const res = await createComment({ userId, productId, rating, comment });
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
            toast.success("Review submitted successfully!")
            queryClient.invalidateQueries({ queryKey: ["user-commented-products"] });
    },
    onError: (error: any) => toast.error(error.message || "Failed to submit review"),
  });



  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-md mx-4 sm:m-0 backdrop-blur-4xl ">
        <DialogHeader>
          <DialogTitle className="my-5">Do you like it?</DialogTitle>
          <Separator className="my-2" />
        </DialogHeader>

        <div className="space-y-6">
          <h2 className="text-md font-medium">{name}</h2>
          {/* Rating */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => {
              const filled = i <= (hover || rating);
              return (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(i)}
                >
                  <Star className={`w-6 h-6 ${filled ? "text-yellow-400" : "text-gray-300"}`} />
                </button>
              );
            })}
          </div>

          {/* Comment */}
          <Textarea
            placeholder="Write your review..."
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {/* Submit button */}
          <Button
            className="flex items-center gap-2"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" strokeWidth={2} />
            ) : (
              "Submit Review"
            )}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}
