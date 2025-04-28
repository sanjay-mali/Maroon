'use client'
import Link from 'next/link';
import { deleteProduct, getAllProducts } from '@/lib/appwrite';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const productsData = await getAllProducts();
    if (productsData) {
      setProducts(productsData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const isDeleted = await deleteProduct(id);
    if(isDeleted){
      toast({
        title: 'Success!',
        description: 'Product deleted successfully',
      });
      fetchData();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: 'Error deleting product',
      });
      }
  };

  return (
    <div>
      <h1>Products</h1>
      {loading && <div>Loading...</div>}
      {!loading && products.length === 0 && <div>No products</div>}
      <Link href="/admin/products/add">
        <button>Add product</button>
      </Link>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
             {product.name} - ${product.price}
            <Link href={`/admin/products/edit/${product.id}`}>
              <button>Edit</button>
            </Link>
             <AlertDialog>
              <AlertDialogTrigger>Delete</AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your product and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <button onClick={() => handleDelete(product.id)}>Continue</button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </li>
        ))}
      </ul>
    </div>
  );
}