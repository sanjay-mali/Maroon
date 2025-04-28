import { getAllUsers, getProductById } from "@/lib/appwrite";
import { useToast } from "@/hooks/use-toast";

export default async function WishlistPage() {
  const { toast } = useToast();

  try {
    const users = await getAllUsers() || [];

    return (
      <div>
        <h1>Wishlist</h1>
        {users && users.length > 0 ? (
          <ul>
            {await Promise.all(users.map(async (user) => {
              if (!user.wishlist || user.wishlist.length === 0) {
                return (
                  <li key={user.$id} className="my-2">
                    <h2>User ID: {user.$id}</h2>
                    <p>No wishlist yet</p>
                  </li>
                );
              }

              const productsData = await Promise.all(
                user.wishlist.map(async (productId: string) => {
                  const product = await getProductById(productId);
                  return product;
                })
              );

              return (
                <li key={user.$id}>
                  <h2 className="font-bold">User ID: {user.$id}</h2>
                  <ul>
                    {productsData.map((product, index) => (
                      product && product.name && product.price ? (
                      <li key={index}>
                        
                        <p>Product Name: {product.name}</p>                        
                       
                        <p>Price: {product.price}</p>
                      </li>
                      ) : null
                    ))}
                  </ul>
                </li>
              );
            }))}
          </ul>
        ) : (
          <p>No users found</p>
        )}
      </div>
    );
  } catch (error) {
    toast({
        variant: "destructive",
        title: "Error",
        description: "Error getting wishlist: " + error,
      });
    return null
  }
}