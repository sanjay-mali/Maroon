import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// Mock data for reviews
const reviews = [
  {
    id: "1",
    author: "John D.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "March 15, 2025",
    title: "Excellent quality and fit",
    content:
      "I'm really impressed with the quality of this t-shirt. The fabric is soft and comfortable, and the fit is perfect. I've already ordered two more in different colors.",
    helpful: 12,
    unhelpful: 2,
  },
  {
    id: "2",
    author: "Sarah M.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    date: "February 28, 2025",
    title: "Great shirt, slightly large",
    content:
      "The quality is excellent and the material feels premium. My only issue is that it runs slightly large. I would recommend sizing down if you prefer a more fitted look.",
    helpful: 8,
    unhelpful: 1,
  },
  {
    id: "3",
    author: "Michael T.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 3,
    date: "February 10, 2025",
    title: "Good but not great",
    content:
      "The shirt is decent quality, but I expected better for the price. The color is slightly different from what's shown in the pictures. It's comfortable though.",
    helpful: 5,
    unhelpful: 3,
  },
]

export default function ProductReviews() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          <div className="flex items-center mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">Based on 24 reviews</span>
          </div>
        </div>
        <Button>Write a Review</Button>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.author} />
                  <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{review.author}</div>
                  <div className="text-sm text-gray-500">{review.date}</div>
                </div>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>

            <h4 className="font-medium mb-2">{review.title}</h4>
            <p className="text-gray-600 mb-4">{review.content}</p>

            <div className="flex items-center gap-4 text-sm">
              <span>Was this review helpful?</span>
              <button className="flex items-center gap-1 text-gray-500 hover:text-gray-900">
                <ThumbsUp size={14} />
                <span>{review.helpful}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-500 hover:text-gray-900">
                <ThumbsDown size={14} />
                <span>{review.unhelpful}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button variant="outline">Load More Reviews</Button>
      </div>
    </div>
  )
}
