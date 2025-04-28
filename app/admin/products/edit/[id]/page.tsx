import ProductForm from '@/components/product-form';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
  const { id } = useParams();

  return (
    <div className='flex items-center justify-center'>
      <ProductForm isEdit={true} />
    </div>
  );
}