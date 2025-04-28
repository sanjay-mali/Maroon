import { CreditCard, Package, Users, ShoppingBag, AlertTriangle } from "lucide-react";
import { getTotalActiveUsers, getTotalOrders, getTotalProducts, getTotalRevenue, getLowStockProducts } from "@/lib/appwrite";
import { promises } from "dns";
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-full bg-gray-200">{icon}</div>
        <div className="flex flex-col">
            <p className="text-gray-500">{title}</p>
            <p className="font-bold text-lg">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const totalProducts = await getTotalProducts()
  const totalRevenue = await getTotalRevenue()
  const totalOrders = await getTotalOrders()
  const totalActiveUsers = await getTotalActiveUsers()
  const lowStockProducts = await getLowStockProducts()

  const totalProductsData = totalProducts ? totalProducts : 0;
  const totalRevenueData = totalRevenue ? totalRevenue : 0; // Changed from getTotalRevenueData
  const totalOrdersData = totalOrders ? totalOrders : 0;
  const totalActiveUsersData = totalActiveUsers ? totalActiveUsers : 0;
  const lowStockProductsData = lowStockProducts ? lowStockProducts.length : 0;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">        
        <MetricCard 
          title="Total Products"
          value={totalProductsData} 
          icon={<Package />} 
        />
        <MetricCard 
          title="Total Revenue" 
          value={totalRevenueData}
          icon={<CreditCard />} 
        />
         <MetricCard
          title="Total Orders"
          value={totalOrdersData}
          icon={<ShoppingBag />} 
        />
        <MetricCard 
          title="Total Active Users" 
          value={totalRevenueData} 
          icon={<Users />} 
        />
        <MetricCard title="Low Stock Products" value={lowStockProductsData} icon={<AlertTriangle />} />
      </div>
    </div>
  );
}