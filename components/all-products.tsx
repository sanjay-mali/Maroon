import ProductCard from "@/components/product-card";
import { getAllProducts } from "@/lib/appwrite";

export default async function AllProducts() {
  const allProducts = await getAllProducts();

  return (
    <>
      {allProducts && allProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {allProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              images={product.images}
            />
          ))}
        </div>
      ) : (
        <p>There are no products yet.</p>
      )}
    </>
  );
}
