import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { addCategory, getCategoryById, updateCategory } from '@/lib/appwrite';

interface CategoryFormProps {
  id?: string;
  initialName?: string;
  isEdit?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  id,
  initialName = '',
  isEdit = false,
}) => {
  const [name, setName] = useState<string>(initialName)
  const router = useRouter();
  const { toast } = useToast()

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (isEdit && id) {
        const categoryData = await getCategoryById(id);
        if (categoryData) {
          setName(categoryData.name)
        }
      }
    };

    fetchCategoryData();
  }, [isEdit, id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      if (isEdit && id) {
        const success = await updateCategory(id, name);
        if (success) {
          toast({
            title: "Success",
            description: "Category updated successfully",
          });
          router.push('/admin/categories')
        }
      }else{
        const success = await addCategory(name);
        if (success) {
          toast({
            title: "Success",
            description: "Category added successfully",
          });
          router.push('/admin/categories');
        }
      } 
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error adding/updating the category",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Category name"
        />
      </div>
      <Button type="submit" className="w-full">
        {isEdit ? 'Update' : 'Save'}
      </Button>
    </form>
  );
};

export default CategoryForm