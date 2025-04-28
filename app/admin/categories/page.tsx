'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getAllCategories, deleteCategory } from '@/lib/appwrite';
import { useAlertDialog } from '@/components/ui/alert-dialog';

const CategoriesPage = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      if (data) {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
    onOpenChange: onDeleteOpenChange,
    AlertDialog,
  } = useAlertDialog();
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setCategoryToDelete(id);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      const deleted = await deleteCategory(categoryToDelete);

      if (deleted) {
        const data = await getAllCategories();
        if (data) {
          setCategories(data);
        }
        toast({
          title: 'Success',
          description: 'Category deleted successfully',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was an error deleting the category',
        });
      }
      setCategoryToDelete(null);
      onDeleteClose();
    }
  };



  return (
    <div>
      <h1>Categories</h1>
      <Link href="/admin/categories/add">
        <button>Add category</button>
      </Link>

      <ul>
        <AlertDialog
          open={isDeleteOpen}
          onOpenChange={onDeleteOpenChange}
          title='Delete category'
          description='Are you sure you want to delete this category?'
          onClose={onDeleteClose}
          buttons={[
            {
              text: 'Cancel',
              variant: 'secondary',
              onClick: onDeleteClose,
            },
            {
              text: 'Delete',
              onClick: confirmDelete,
            },
          ]}
        />
        {categories.map((category) => (
          <li key={category.id}>
            {category.name}
            <Link href={`/admin/categories/edit/${category.id}`}>
              <button>Edit</button>
            </Link>
            <button onClick={() => handleDelete(category.id)}>Delete</button>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default CategoriesPage;