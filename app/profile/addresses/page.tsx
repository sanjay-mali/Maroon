import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProfileSidebar from "@/components/profile-sidebar"
import AddressCard from "@/components/address-card"
import Footer from "@/components/footer"

export default function AddressesPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">My Addresses</h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Saved Addresses</h2>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Add New Address</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AddressCard
                name="John Doe"
                address="123 Main Street, Apt 4B"
                city="New York"
                state="NY"
                zip="10001"
                country="United States"
                phone="+1 (555) 123-4567"
                isDefault={true}
              />

              <AddressCard
                name="John Doe"
                address="456 Park Avenue, Suite 789"
                city="San Francisco"
                state="CA"
                zip="94107"
                country="United States"
                phone="+1 (555) 987-6543"
                isDefault={false}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
