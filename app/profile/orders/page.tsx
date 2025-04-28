import ProfileSidebar from "@/components/profile-sidebar"
import OrderCard from "@/components/order-card"
import Footer from "@/components/footer"

export default function OrdersPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">My Orders</h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="space-y-6">
              <OrderCard orderId="ORD12345" date="April 28, 2025" status="Delivered" items={3} total={149.97} />

              <OrderCard orderId="ORD12344" date="April 15, 2025" status="Shipped" items={2} total={89.98} />

              <OrderCard orderId="ORD12343" date="March 30, 2025" status="Processing" items={1} total={49.99} />

              <OrderCard orderId="ORD12342" date="March 15, 2025" status="Delivered" items={4} total={199.96} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
