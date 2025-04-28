import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; 
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addProduct, getAllCategories, getProductById, updateProduct, appwrite } from '@/lib/appwrite';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { ID, storage } from 'appwrite';
export interface Product {
  name: string;
  description: string;
  price: string;
  stock: string;
  sizes: string[]; // updated to array of strings
  colors: string[]; // updated to array of strings
  category: string;
  images: string[];
}
interface ProductFormProps {
  isEdit: boolean;
  productId?: string | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ isEdit, productId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState('');
  const [colors, setColors] = useState<string[]>([]); 
  const [newColor, setNewColor] = useState('');
  const [category, setCategory] = useState(''); 
  const [files, setFiles] = useState<File[]>([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([`/placeholder.jpg`]);
  const [categories, setCategories] = useState<{ id: string; name: string; }[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isEdit && productId) {
      fetchProductData(productId);
    }
    const fetchCategories = async () => {
      const categoriesData = await getAllCategories();
      if (categoriesData) {
        setCategories(categoriesData);
      }
    };
    fetchCategories();
  }, [isEdit, productId]);

  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
    }
  };

  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor('');
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setFiles(files);
 
      const previews = files.map(file => URL.createObjectURL(file));
      setImagesPreview(previews.length > 0 ? previews : [`/placeholder.jpg`]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      let result;
      const product:Product = { name, description, price, stock, sizes, colors, category, images: [] };
      if (isEdit && productId) {
        result = await updateProduct(productId, product);
      } else {
        result = await addProduct(product);
      }

      const imageUrlsPromises = files.map(file => {
        return storage.createFile(process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID as string, ID.custom(result.$id), file);
      });

      const filesResult = await Promise.all(imageUrlsPromises)
      const images:string[] = filesResult.map(file => appwrite.getFilePreview(process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID as string, file.$id))
      
      if (result) {
        result = await addProduct(product);
      }
      console.log(result)
      if (result) {
        toast({
          title: "Success",
          description: isEdit
            ? "The product was updated successfully"
            : "The product was created successfully",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
        router.push('/admin/products');
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: isEdit
            ? "There was an error updating the product"
            : "There was an error creating the product",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: isEdit
            ? "There was an error updating the product"
            : "There was an error creating the product",
        action: <ToastAction altText="Close">Close</ToastAction>,
      });
    }
  };

  const fetchProductData = async (id: string) => {
    const productData = await getProductById(id);
    if (productData) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setStock(productData.stock);
      setSizes(productData.sizes);
      setColors(productData.colors);
      setCategory(productData.category);
    }
  };

  return (
    <div className="flex gap-8">
        <form onSubmit={handleSubmit} className="w-1/2">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stock">Stock</Label>
          <Input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label>Sizes</Label>
          <div className='flex gap-2 items-center'>
              <Input type="text" value={newSize} onChange={(e) => setNewSize(e.target.value)} placeholder="Add size" />
              <Button type="button" onClick={handleAddSize}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size, index) => (
              <span key={index} className="bg-gray-200 px-2 py-1 rounded">{size}</span>
            ))}
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Colors</Label>
          <div className='flex gap-2 items-center'>
              <Input type="text" value={newColor} onChange={(e) => setNewColor(e.target.value)} placeholder="Add color" />
              <Button type="button" onClick={handleAddColor}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
              <span key={index} className="bg-gray-200 px-2 py-1 rounded">{color}</span>
            ))}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="images">Images</Label>
          <Input type="file" id="images" multiple onChange={handleImageChange} accept="image/*" />
          <div className='flex gap-2 mt-2'>
            {imagesPreview.map((preview, index) => (<img key={index} src={preview} className='w-[100px] h-[100px] object-cover' alt={`preview ${index}`} />))}
          </div> 
        </div>
        <Button type="submit">{isEdit ? "Update" : "Save"}</Button>
      </div>
    </form>
      <div className='w-1/2 border rounded p-4'>
        <Label>Live Preview</Label>
        <div className='flex justify-center w-full'>
          <img src={imagesPreview.length > 0 ? imagesPreview[0] : `/placeholder.jpg`} className='w-[200px] h-[300px] object-cover' alt='preview'/>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;