import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X, Upload, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; 
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import dbService from '@/appwrite/database';

export interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  sizes: string[];
  colors: string[];
  categories: string[];
  images: string[];
  is_published?: boolean;
  is_draft?: boolean;
  is_featured?: boolean;
  is_new?: boolean;
  is_disabled?: boolean;
  discount_price?: number;
}

interface ProductFormProps {
  isEdit: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ isEdit }) => {
  const params = useParams();
  const productId = isEdit ? params.id as string : null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState('');
  const [colors, setColors] = useState<string[]>([]); 
  const [newColor, setNewColor] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); 
  const [isPublished, setIsPublished] = useState(false);
  const [isDraft, setIsDraft] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  
  const [files, setFiles] = useState<File[]>([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const categoriesResult = await dbService.getAllCategories(1, 100);
        if (categoriesResult && categoriesResult.documents) {
          setCategories(categoriesResult.documents.map(cat => ({
            id: cat.id,
            name: cat.name
          })));
        }

        // If editing, fetch product data
        if (isEdit && productId) {
          const productData = await dbService.getProductById(productId);
          if (productData) {
            setName(productData.name || '');
            setDescription(productData.description || '');
            setPrice(productData.price?.toString() || '');
            setDiscountPrice(productData.discount_price?.toString() || '');
            setStock(productData.stock?.toString() || '');
            setSizes(productData.sizes || []);
            setColors(productData.colors || []);
            setSelectedCategories(productData.categories || []);
            setExistingImages(productData.images || []);
            setIsPublished(productData.is_published || false);
            setIsDraft(productData.is_draft !== undefined ? productData.is_draft : true);
            setIsFeatured(productData.is_featured || false);
            setIsNew(productData.is_new || false);
          }
        }
      } catch (error) {
        console.error('Error initializing product form:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [isEdit, productId, toast]);

  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes(sizes.filter(size => size !== sizeToRemove));
  };

  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor('');
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setColors(colors.filter(color => color !== colorToRemove));
  };

  const handleCategoryChange = (value: string) => {
    if (!selectedCategories.includes(value)) {
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories(selectedCategories.filter(cat => cat !== value));
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
 
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setImagesPreview(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagesPreview(imagesPreview.filter((_, i) => i !== index));
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (selectedCategories.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one category",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      let uploadedImageUrls: string[] = [];
      if (files.length > 0) {
        uploadedImageUrls = await dbService.uploadImages(files);
      }
      const allImages = [...existingImages, ...uploadedImageUrls];
      
      const productData: Product = {
        name,
        description,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        sizes,
        colors,
        categories: selectedCategories,
        images: allImages, // store URLs directly
        is_published: isPublished,
        is_draft: isDraft,
        is_featured: isFeatured,
        is_new: isNew
      };
      
      if (discountPrice && parseFloat(discountPrice) > 0) {
        productData.discount_price = parseFloat(discountPrice);
      }

      let result;
      if (isEdit && productId) {
        result = await dbService.updateProduct(productId, productData);
      } else {
        result = await dbService.addNewProduct(productData);
      }
      
      if (result) {
        toast({
          title: "Success",
          description: isEdit
            ? "The product was updated successfully"
            : "The product was created successfully",
        });
        router.push('/admin/products');
      } else {
        throw new Error("Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: isEdit
            ? "There was an error updating the product"
            : "There was an error creating the product",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 w-full">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>{isEdit ? "Loading product data..." : "Preparing form..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="w-full lg:w-2/3">
        <h1 className="text-2xl font-bold mb-6">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter product name"
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    rows={4}
                    placeholder="Enter product description"
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Product Status</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                      <Label htmlFor="isPublished">Published</Label>
                      <Switch
                        id="isPublished"
                        checked={isPublished}
                        onCheckedChange={setIsPublished}
                      />
                    </div>
                    <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                      <Label htmlFor="isDraft">Draft</Label>
                      <Switch
                        id="isDraft"
                        checked={isDraft}
                        onCheckedChange={setIsDraft}
                      />
                    </div>
                    <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                      <Label htmlFor="isFeatured">Featured</Label>
                      <Switch
                        id="isFeatured"
                        checked={isFeatured}
                        onCheckedChange={setIsFeatured}
                      />
                    </div>
                    <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                      <Label htmlFor="isNew">New Arrival</Label>
                      <Switch
                        id="isNew"
                        checked={isNew}
                        onCheckedChange={setIsNew}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Regular Price (₹)</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        id="price" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                        required 
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₹</span>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="discountPrice">Sale Price (₹)</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        id="discountPrice" 
                        value={discountPrice} 
                        onChange={(e) => setDiscountPrice(e.target.value)} 
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₹</span>
                    </div>
                  </div>
                </div>
                
                {discountPrice && parseFloat(discountPrice) > 0 && parseFloat(price) > 0 && (
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 mt-4">
                    <div className="flex justify-between">
                      <span>Regular Price:</span>
                      <span>₹{parseFloat(price).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sale Price:</span>
                      <span>₹{parseFloat(discountPrice).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2 mt-2">
                      <span>Discount:</span>
                      <span className="text-green-600">
                        {Math.round((1 - parseFloat(discountPrice) / parseFloat(price)) * 100)}% off
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory & Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input 
                    type="number" 
                    id="stock" 
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)} 
                    min="0"
                    placeholder="0"
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Categories</Label>
                  <div className="border rounded-md p-4 grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                    {categories.length === 0 ? (
                      <p className="col-span-3 text-center text-muted-foreground py-4">No categories found. Please add categories first.</p>
                    ) : (
                      categories.map(category => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor={`category-${category.id}`} className="cursor-pointer text-sm font-normal">
                            {category.name}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                  {selectedCategories.length === 0 && (
                    <p className="text-sm text-red-500">Please select at least one category</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label>Available Sizes</Label>
                  <div className='flex gap-2 items-center'>
                    <Input 
                      type="text" 
                      value={newSize} 
                      onChange={(e) => setNewSize(e.target.value)} 
                      placeholder="Add size (e.g. S, M, L, XL)" 
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddSize}
                      size="icon"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sizes.length === 0 && (
                      <p className="text-sm text-muted-foreground">No sizes added yet</p>
                    )}
                    {sizes.map((size, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        {size}
                        <button 
                          type="button"
                          onClick={() => handleRemoveSize(size)}
                          className="text-red-500 hover:text-red-700 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Available Colors</Label>
                  <div className='flex gap-2 items-center'>
                    <Input 
                      type="text" 
                      value={newColor} 
                      onChange={(e) => setNewColor(e.target.value)} 
                      placeholder="Add color (e.g. Red, Blue, Green)" 
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddColor}
                      size="icon"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {colors.length === 0 && (
                      <p className="text-sm text-muted-foreground">No colors added yet</p>
                    )}
                    {colors.map((color, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        {color}
                        <button 
                          type="button"
                          onClick={() => handleRemoveColor(color)}
                          className="text-red-500 hover:text-red-700 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer" onClick={() => document.getElementById('image-upload')?.click()}>
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-base font-medium">Upload Images</h3>
                    <p className="text-sm text-muted-foreground mt-1">Drag and drop or click to upload</p>
                    <input
                      type="file"
                      id="image-upload"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    <p className="text-xs text-muted-foreground mt-3">SVG, PNG, JPG or GIF (Max. 2MB)</p>
                  </div>
                  
                  <div>
                    <Label className="block mb-3">Existing Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {existingImages.length === 0 && (
                        <p className="col-span-full text-sm text-muted-foreground">No existing images</p>
                      )}
                      {existingImages.map((imageUrl, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img 
                            src={imageUrl} 
                            className="w-full h-full object-cover rounded-md border" 
                            alt={`Product image ${index + 1}`} 
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block mb-3">New Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagesPreview.length === 0 && (
                        <p className="col-span-full text-sm text-muted-foreground">No new images selected</p>
                      )}
                      {imagesPreview.map((preview, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img 
                            src={preview} 
                            className="w-full h-full object-cover rounded-md border" 
                            alt={`New image ${index + 1}`} 
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex gap-3 pt-8">
          <Button 
            type="button" 
            variant="outline"
            className="flex-1" 
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                {isEdit ? 'Updating...' : 'Save Product'}
              </>
            ) : (
              isEdit ? 'Update Product' : 'Save Product'
            )}
          </Button>
        </div>
      </form>
      
      <div className='w-full lg:w-1/3'>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className='aspect-[3/4] w-full bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden'>
                {(existingImages.length > 0 || imagesPreview.length > 0) ? (
                  <img 
                    src={(existingImages[0] || imagesPreview[0])} 
                    className='w-full h-full object-cover' 
                    alt='Product preview'
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <span>No image</span>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-bold text-lg">{name || "Product Name"}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-3">
                  {description || "Product description will appear here"}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {discountPrice && parseFloat(discountPrice) > 0 ? (
                  <>
                    <span className="font-bold">₹{parseFloat(discountPrice).toLocaleString()}</span>
                    <span className="text-gray-500 line-through">₹{parseFloat(price).toLocaleString() || 0}</span>
                    <span className="text-green-600 text-sm ml-auto">
                      {price && discountPrice ? `${Math.round((1 - parseFloat(discountPrice) / parseFloat(price)) * 100)}% off` : ''}
                    </span>
                  </>
                ) : (
                  <span className="font-bold">₹{parseFloat(price).toLocaleString() || 0}</span>
                )}
              </div>
              
              {selectedCategories.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium">Categories:</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedCategories.map((categoryId, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {getCategoryName(categoryId) || 'Category'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {sizes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium">Sizes:</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {sizes.map((size, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {colors.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium">Colors:</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {colors.map((color, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <span className={parseInt(stock) > 0 ? "text-green-600" : "text-red-600"}>
                  {parseInt(stock) > 0 ? `In Stock (${stock})` : "Out of Stock"}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {isPublished && <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded">Published</span>}
                {isDraft && <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-2 py-1 rounded">Draft</span>}
                {isFeatured && <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs px-2 py-1 rounded">Featured</span>}
                {isNew && <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded">New Arrival</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductForm;
