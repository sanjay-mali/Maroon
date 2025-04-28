import CategoryForm from '@/components/category-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Edit Category | Admin Panel",
};
interface Props {
    params: { id: string };
  }

export default function EditCategoryPage({ params }: Props) {
  return (
    <div className="flex items-center justify-center">
      <CategoryForm isEdit={true} id={params.id} />
    </div>
  );
}