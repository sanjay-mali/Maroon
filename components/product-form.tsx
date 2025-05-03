"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dbService from "@/appwrite/database";
import ProductImageCarousel from "./product-image-carousel";
import { Editor } from "@tinymce/tinymce-react";

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
  productId?: string;
}

const defaultColors = [
  { id: "black", name: "Black", value: "#000000" },
  { id: "white", name: "White", value: "#FFFFFF" },
  { id: "red", name: "Red", value: "#FF0000" },
  { id: "blue", name: "Blue", value: "#0000FF" },
  { id: "green", name: "Green", value: "#00FF00" },
  { id: "yellow", name: "Yellow", value: "#FFFF00" },
];
const defaultSizes = [
  { id: "xs", label: "XS" },
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
  { id: "xxl", label: "XXL" },
];

const ProductForm: React.FC<ProductFormProps> = ({ isEdit, productId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [newColor, setNewColor] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("draft");
  const [isPublished, setIsPublished] = useState(false);
  const [isDraft, setIsDraft] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const editorRef = useRef<any>(null);

  const { toast } = useToast();
  const router = useRouter();

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const MAX_IMAGES = 8;

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const categoriesResult = await dbService.getAllCategories(1, 100);
        if (categoriesResult && categoriesResult.documents) {
          setCategories(
            categoriesResult.documents.map((cat) => ({
              id: cat.id,
              name: cat.name,
            }))
          );
        }

        // If editing, fetch product data
        if (isEdit && productId) {
          const productData = await dbService.getProductById(productId);
          if (productData) {
            setName(productData.name || "");
            setDescription(productData.description || "");
            setPrice(productData.price?.toString() || "");
            setDiscountPrice(productData.discount_price?.toString() || "");
            setStock(productData.stock?.toString() || "");
            setSizes(productData.sizes || []);
            setColors(productData.colors || []);
            setSelectedCategories(productData.categories || []);
            setExistingImages(productData.images || []);
            setIsPublished(productData.is_published || false);
            setIsDraft(
              productData.is_draft !== undefined ? productData.is_draft : true
            );
            setIsFeatured(productData.is_featured || false);
            setIsNew(productData.is_new || false);
            setIsDisabled(productData.is_disabled || false);
            setStatus(
              productData.is_published
                ? "published"
                : productData.is_disabled
                ? "disabled"
                : "draft"
            );
          }
        }
      } catch (error) {
        console.error("Error initializing product form:", error);
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

  console.log("categories", categories);

  useEffect(() => {
    setIsPublished(status === "published");
    setIsDraft(status === "draft");
    setIsDisabled(status === "disabled");
  }, [status]);

  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize("");
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes(sizes.filter((size) => size !== sizeToRemove));
  };

  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor("");
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setColors(colors.filter((color) => color !== colorToRemove));
  };

  const handleCategoryChange = (value: string) => {
    if (!selectedCategories.includes(value)) {
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== value));
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      // Validate total number of images
      if (
        files.length + selectedFiles.length + existingImages.length >
        MAX_IMAGES
      ) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `You can only upload up to ${MAX_IMAGES} images in total.`,
        });
        return;
      }

      // Validate file size and type
      const validFiles = selectedFiles.filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast({
            variant: "destructive",
            title: "Error",
            description: `${file.name} is too large. Maximum size is 2MB.`,
          });
          return false;
        }
        if (!file.type.startsWith("image/")) {
          toast({
            variant: "destructive",
            title: "Error",
            description: `${file.name} is not an image file.`,
          });
          return false;
        }
        return true;
      });

      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setImagesPreview((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imagesPreview[index]); // Clean up object URL
    setImagesPreview(imagesPreview.filter((_, i) => i !== index));
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      imagesPreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagesPreview]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Required field checks
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Product name is required",
      });
      return;
    }
    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Product description is required",
      });
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Valid price is required",
      });
      return;
    }
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Valid stock quantity is required",
      });
      return;
    }
    if (selectedCategories.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one category",
      });
      return;
    }
    if (sizes.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add at least one size",
      });
      return;
    }
    if (colors.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add at least one color",
      });
      return;
    }
    if (files.length + existingImages.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload at least one product image",
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

      // Ensure categories is an array of string IDs
      const categoryIds = selectedCategories.map((cat: any) =>
        typeof cat === "string" ? cat : cat.id || cat.$id || ""
      );

      const productData: Product = {
        name,
        description,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        sizes,
        colors,
        categories: categoryIds,
        images: allImages, // store URLs directly
        is_published: isPublished,
        is_draft: isDraft,
        is_featured: isFeatured,
        is_new: isNew,
        is_disabled: isDisabled,
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
        router.push("/admin/products");
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
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "";
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
          {isEdit ? "Edit Product" : "Add New Product"}
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
                  <div className="border rounded-md">
                    <Editor
                      id="description"
                      apiKey="your-tinymce-api-key"
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      initialValue={description}
                      onEditorChange={(content) => setDescription(content)}
                      init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "charmap",
                          "preview",
                          "anchor",
                          "searchreplace",
                          "visualblocks",
                          "code",
                          "fullscreen",
                          "insertdatetime",
                          "media",
                          "table",
                          "code",
                          "help",
                          "wordcount",
                        ],
                        toolbar:
                          "undo redo | blocks | " +
                          "bold italic forecolor | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "removeformat | help",
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                        placeholder: "Enter product description",
                      }}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Product Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border rounded-md p-2"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                    <Label htmlFor="isFeatured">Featured</Label>
                    <input
                      id="isFeatured"
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-primary h-5 w-5"
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                    <Label htmlFor="isNew">New Arrival</Label>
                    <input
                      id="isNew"
                      type="checkbox"
                      checked={isNew}
                      onChange={(e) => setIsNew(e.target.checked)}
                      className="accent-primary h-5 w-5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set your product pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Regular Price (₹)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        ₹
                      </span>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="pl-7"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountPrice">Sale Price (₹)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        ₹
                      </span>
                      <Input
                        id="discountPrice"
                        type="number"
                        placeholder="0.00"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                        className="pl-7"
                      />
                    </div>
                    {price &&
                      discountPrice &&
                      parseFloat(discountPrice) > 0 && (
                        <div className="text-sm">
                          <span className="text-green-600 font-medium">
                            {Math.round(
                              (1 -
                                parseFloat(discountPrice) / parseFloat(price)) *
                                100
                            )}
                            % off
                          </span>
                        </div>
                      )}
                  </div>
                </div>
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
                      <p className="col-span-3 text-center text-muted-foreground py-4">
                        No categories found. Please add categories first.
                      </p>
                    ) : (
                      categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label
                            htmlFor={`category-${category.id}`}
                            className="cursor-pointer text-sm font-normal"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                  {selectedCategories.length === 0 && (
                    <p className="text-sm text-red-500">
                      Please select at least one category
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>Available Sizes</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {defaultSizes.map((size) => (
                      <Button
                        key={size.id}
                        type="button"
                        variant={
                          sizes.includes(size.label) ? "default" : "outline"
                        }
                        size="sm"
                        className="rounded-full px-3"
                        onClick={() => {
                          if (sizes.includes(size.label)) {
                            setSizes(sizes.filter((s) => s !== size.label));
                          } else {
                            setSizes([...sizes, size.label]);
                          }
                        }}
                      >
                        {size.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="text"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Add custom size"
                    />
                    <Button type="button" onClick={handleAddSize} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sizes.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No sizes added yet
                      </p>
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
                  <div className="flex flex-wrap gap-2 mb-2">
                    {defaultColors.map((color) => (
                      <Button
                        key={color.id}
                        type="button"
                        variant={
                          colors.includes(color.name) ? "default" : "outline"
                        }
                        size="sm"
                        className="rounded-full px-3"
                        style={{
                          backgroundColor: color.value,
                          color: color.id === "white" ? "#000" : "#fff",
                        }}
                        onClick={() => {
                          if (colors.includes(color.name)) {
                            setColors(colors.filter((c) => c !== color.name));
                          } else {
                            setColors([...colors, color.name]);
                          }
                        }}
                      >
                        {color.name}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="Add custom color"
                    />
                    <Button type="button" onClick={handleAddColor} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {colors.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No colors added yet
                      </p>
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
                <CardDescription>
                  Upload up to {MAX_IMAGES} images. First image will be the main
                  product image.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-base font-medium">Upload Images</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {files.length + existingImages.length === MAX_IMAGES
                      ? "Maximum number of images reached"
                      : "Drag and drop or click to upload"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    SVG, PNG, JPG or GIF (Max. 2MB per image)
                  </p>
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                    disabled={
                      files.length + existingImages.length >= MAX_IMAGES
                    }
                  />
                </div>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div>
                    <Label className="block mb-3">Existing Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {existingImages.map((imageUrl, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square"
                        >
                          <img
                            src={imageUrl}
                            className="w-full h-full object-cover rounded-md border"
                            alt={`Product image ${index + 1}`}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => handleRemoveExistingImage(index)}
                              className="h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Preview */}
                {imagesPreview.length > 0 && (
                  <div>
                    <Label className="block mb-3">New Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagesPreview.map((preview, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square"
                        >
                          <img
                            src={preview}
                            className="w-full h-full object-cover rounded-md border"
                            alt={`New image ${index + 1}`}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => handleRemoveImage(index)}
                              className="h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-8">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                {isEdit ? "Updating..." : "Save Product"}
              </>
            ) : isEdit ? (
              "Update Product"
            ) : (
              "Save Product"
            )}
          </Button>
        </div>
      </form>

      <div className="w-full lg:w-1/3">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ProductImageCarousel
                images={[...existingImages, ...imagesPreview]}
              />
              <div>
                <h3 className="font-bold text-lg">{name || "Product Name"}</h3>
                <div className="text-sm text-gray-500 mt-1 line-clamp-3">
                  {description ? (
                    <div
                      className="rich-text-content"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  ) : (
                    <p>Product description will appear here</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {discountPrice &&
                !isNaN(Number(discountPrice)) &&
                Number(discountPrice) > 0 &&
                price &&
                !isNaN(Number(price)) &&
                Number(price) > 0 &&
                Number(discountPrice) < Number(price) ? (
                  <>
                    <span className="font-bold">
                      ₹{parseFloat(discountPrice).toLocaleString()}
                    </span>
                    <span className="text-gray-500 line-through">
                      ₹{parseFloat(price).toLocaleString()}
                    </span>
                    <span className="text-green-600 text-sm ml-auto">
                      {`${Math.round(
                        (1 - parseFloat(discountPrice) / parseFloat(price)) *
                          100
                      )}% off`}
                    </span>
                  </>
                ) : (
                  <span className="font-bold">
                    ₹
                    {!isNaN(Number(price)) && price && Number(price) > 0
                      ? parseFloat(price).toLocaleString()
                      : "-"}
                  </span>
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
                        {getCategoryName(categoryId) || "Category"}
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
                <span
                  className={
                    parseInt(stock) > 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {parseInt(stock) > 0 ? `In Stock (${stock})` : "Out of Stock"}
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {isPublished && (
                  <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded">
                    Published
                  </span>
                )}
                {isDraft && (
                  <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-2 py-1 rounded">
                    Draft
                  </span>
                )}
                {isFeatured && (
                  <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs px-2 py-1 rounded">
                    Featured
                  </span>
                )}
                {isNew && (
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded">
                    New Arrival
                  </span>
                )}
                {isDisabled && (
                  <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs px-2 py-1 rounded">
                    Disabled
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductForm;
