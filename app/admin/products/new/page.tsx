"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NewProductPage() {
  const { toast } = useToast();
  const [productImages, setProductImages] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const colors = [
    { id: "black", name: "Black", value: "#000000" },
    { id: "white", name: "White", value: "#FFFFFF" },
    { id: "red", name: "Red", value: "#FF0000" },
    { id: "blue", name: "Blue", value: "#0000FF" },
    { id: "green", name: "Green", value: "#00FF00" },
    { id: "yellow", name: "Yellow", value: "#FFFF00" },
    { id: "purple", name: "Purple", value: "#800080" },
    { id: "pink", name: "Pink", value: "#FFC0CB" },
    { id: "gray", name: "Gray", value: "#808080" },
  ];

  const sizes = [
    { id: "xs", label: "XS" },
    { id: "s", label: "S" },
    { id: "m", label: "M" },
    { id: "l", label: "L" },
    { id: "xl", label: "XL" },
    { id: "xxl", label: "XXL" },
  ];

  const handleAddImage = () => {
    // In a real app, this would handle file uploads
    // For now, we'll just add a placeholder image
    setProductImages([
      ...productImages,
      `/placeholder.svg?height=300&width=300&text=Image ${
        productImages.length + 1
      }`,
    ]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...productImages];
    newImages.splice(index, 1);
    setProductImages(newImages);
  };

  const handleColorToggle = (colorId: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId]
    );
  };

  const handleSizeToggle = (sizeId: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sizeId)
        ? prev.filter((id) => id !== sizeId)
        : [...prev, sizeId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Product created",
      description: "The product has been created successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/admin/products">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Products
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Add New Product</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button onClick={handleSubmit}>Save Product</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                  <CardDescription>
                    Enter the basic details of your product.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" placeholder="Enter product name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter product description"
                      rows={5}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tops">Tops</SelectItem>
                          <SelectItem value="bottoms">Bottoms</SelectItem>
                          <SelectItem value="dresses">Dresses</SelectItem>
                          <SelectItem value="outerwear">Outerwear</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                  <CardDescription>
                    Set your product's price and inventory details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Regular Price (₹)</Label>
                      <Input id="price" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sale-price">Sale Price (₹)</Label>
                      <Input id="sale-price" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost">Cost Price (₹)</Label>
                      <Input id="cost" type="number" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input id="sku" placeholder="Enter SKU" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input id="stock" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="low-stock">Low Stock Threshold</Label>
                      <Input id="low-stock" type="number" placeholder="10" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="variants" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Colors</CardTitle>
                  <CardDescription>
                    Select the available colors for this product.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <div
                        key={color.id}
                        className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center ${
                          selectedColors.includes(color.id)
                            ? "ring-2 ring-offset-2 ring-black"
                            : ""
                        }`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => handleColorToggle(color.id)}
                        title={color.name}
                      >
                        {selectedColors.includes(color.id) && (
                          <span
                            className={`text-xs ${
                              color.id === "white" ? "text-black" : "text-white"
                            }`}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sizes</CardTitle>
                  <CardDescription>
                    Select the available sizes for this product.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <div
                        key={size.id}
                        className={`min-w-[3rem] h-10 px-3 rounded-md border flex items-center justify-center cursor-pointer ${
                          selectedSizes.includes(size.id)
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => handleSizeToggle(size.id)}
                      >
                        {size.label}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Information</CardTitle>
                  <CardDescription>
                    Optimize your product for search engines.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta-title">Meta Title</Label>
                    <Input id="meta-title" placeholder="Enter meta title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-description">Meta Description</Label>
                    <Textarea
                      id="meta-description"
                      placeholder="Enter meta description"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="Enter keywords separated by commas"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>
                    Add extra details about your product.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input id="material" placeholder="Enter material" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="care">Care Instructions</Label>
                    <Textarea
                      id="care"
                      placeholder="Enter care instructions"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="featured" />
                    <Label htmlFor="featured">Mark as featured product</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="new-arrival" />
                    <Label htmlFor="new-arrival">Mark as new arrival</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload images of your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md overflow-hidden border"
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="aspect-square flex flex-col items-center justify-center border-dashed"
                  onClick={handleAddImage}
                >
                  <Upload className="h-6 w-6 mb-2" />
                  <span className="text-sm">Add Image</span>
                </Button>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                You can upload up to 8 images. First image will be used as the
                product thumbnail.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
              <CardDescription>
                Control the visibility of your product.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="draft">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="track-inventory" defaultChecked />
                <Label htmlFor="track-inventory">Track inventory</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="allow-backorders" />
                <Label htmlFor="allow-backorders">Allow backorders</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Preview</CardTitle>
              <CardDescription>See how your product will look.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[3/4] rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {productImages.length > 0 ? (
                  <img
                    src={productImages[0] || "/placeholder.svg"}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Add images to see a preview of your product
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { ShoppingBag } from "lucide-react";
