import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AddressCardProps {
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  isDefault?: boolean
}

export default function AddressCard({
  name,
  address,
  city,
  state,
  zip,
  country,
  phone,
  isDefault = false,
}: AddressCardProps) {
  return (
    <div className="border rounded-lg p-4 relative">
      {isDefault && <Badge className="absolute top-4 right-4">Default</Badge>}

      <div className="font-medium mb-1">{name}</div>
      <div className="text-gray-600 mb-1">{address}</div>
      <div className="text-gray-600 mb-1">
        {city}, {state} {zip}
      </div>
      <div className="text-gray-600 mb-3">{country}</div>
      <div className="text-gray-600 mb-4">{phone}</div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="h-8">
          <Edit className="h-3.5 w-3.5 mr-1" />
          <span>Edit</span>
        </Button>
        {!isDefault && (
          <Button variant="outline" size="sm" className="h-8">
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            <span>Delete</span>
          </Button>
        )}
        {!isDefault && (
          <Button variant="link" size="sm" className="h-8 ml-auto">
            Set as Default
          </Button>
        )}
      </div>
    </div>
  )
}
