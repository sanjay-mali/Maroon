"use client"

import { useState } from "react"
import { Search, MoreHorizontal, Eye, Edit, Trash2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

// Dummy data for addresses
const addresses = [
  {
    id: "1",
    userId: "1",
    userName: "Priya Sharma",
    addressLine1: "123 Main Street",
    addressLine2: "Apartment 4B",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India",
    phone: "+91 98765 43210",
    isDefault: true,
  },
  {
    id: "2",
    userId: "1",
    userName: "Priya Sharma",
    addressLine1: "456 Park Avenue",
    addressLine2: "",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400002",
    country: "India",
    phone: "+91 98765 43210",
    isDefault: false,
  },
  {
    id: "3",
    userId: "2",
    userName: "Ananya Patel",
    addressLine1: "789 Oak Street",
    addressLine2: "Building C, Flat 12",
    city: "Delhi",
    state: "Delhi",
    postalCode: "110001",
    country: "India",
    phone: "+91 87654 32109",
    isDefault: true,
  },
  {
    id: "4",
    userId: "3",
    userName: "Neha Gupta",
    addressLine1: "321 Pine Road",
    addressLine2: "",
    city: "Bangalore",
    state: "Karnataka",
    postalCode: "560001",
    country: "India",
    phone: "+91 76543 21098",
    isDefault: true,
  },
  {
    id: "5",
    userId: "5",
    userName: "Meera Reddy",
    addressLine1: "654 Maple Avenue",
    addressLine2: "Near City Mall",
    city: "Chennai",
    state: "Tamil Nadu",
    postalCode: "600001",
    country: "India",
    phone: "+91 65432 10987",
    isDefault: true,
  },
  {
    id: "6",
    userId: "5",
    userName: "Meera Reddy",
    addressLine1: "987 Cedar Lane",
    addressLine2: "Office Complex",
    city: "Chennai",
    state: "Tamil Nadu",
    postalCode: "600002",
    country: "India",
    phone: "+91 65432 10987",
    isDefault: false,
  },
]

export default function AddressesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // Filter addresses based on search query
  const filteredAddresses = addresses.filter((address) => {
    const searchString =
      `${address.userName} ${address.addressLine1} ${address.city} ${address.state} ${address.postalCode} ${address.country}`.toLowerCase()
    return searchString.includes(searchQuery.toLowerCase())
  })

  const handleDeleteAddress = (id: string) => {
    toast({
      title: "Address deleted",
      description: "The address has been deleted successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Customer Addresses</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Address Management</CardTitle>
          <CardDescription>View and manage customer shipping addresses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search addresses..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Postal Code</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAddresses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No addresses found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAddresses.map((address) => (
                    <TableRow key={address.id}>
                      <TableCell className="font-medium">{address.userName}</TableCell>
                      <TableCell>
                        {address.addressLine1}
                        {address.addressLine2 && <span>, {address.addressLine2}</span>}
                      </TableCell>
                      <TableCell>{address.city}</TableCell>
                      <TableCell>{address.state}</TableCell>
                      <TableCell>{address.postalCode}</TableCell>
                      <TableCell>
                        {address.isDefault ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Default
                          </Badge>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {!address.isDefault && (
                              <DropdownMenuItem>
                                <MapPin className="h-4 w-4 mr-2" />
                                Set as Default
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteAddress(address.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium">{filteredAddresses.length}</span> of{" "}
              <span className="font-medium">{addresses.length}</span> addresses
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
