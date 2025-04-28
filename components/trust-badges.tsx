import { Truck, RotateCcw, ShieldCheck, Award, Clock, CreditCard } from "lucide-react"

export default function TrustBadges() {
  const badges = [
    {
      icon: <Truck className="h-6 w-6" />,
      text: "Free Shipping",
    },
    {
      icon: <RotateCcw className="h-6 w-6" />,
      text: "Easy Returns",
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      text: "Secure Payments",
    },
    {
      icon: <Award className="h-6 w-6" />,
      text: "Premium Quality",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      text: "24/7 Support",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      text: "COD Available",
    },
  ]

  return (
    <div className="container-custom">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {badges.map((badge, index) => (
          <div key={index} className="flex flex-col items-center justify-center text-center">
            <div className="text-primary mb-2">{badge.icon}</div>
            <p className="text-xs md:text-sm font-medium">{badge.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
