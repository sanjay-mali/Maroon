"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Upload,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import dbService from "@/appwrite/database";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { toast } = useToast();

  // Fetch categories on component mount and when page changes
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const result = await dbService.getAllCategories(
          currentPage,
          itemsPerPage
        );
        if (result) {
          setCategories(result.documents);
          setTotal(result.total);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load categories. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [toast, currentPage, itemsPerPage]);

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategory.name.trim()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Category name is required.",
        });
        return;
      }

      let imageId = "";

      // Upload the image if one is selected
      if (selectedImage) {
        const uploadResult = await dbService.uploadImage(selectedImage);
        if (uploadResult) {
          imageId = uploadResult.fileId;
        }
      }

      // Create the new category with the image ID
      const result = await dbService.addNewCategory(
        newCategory.name,
        newCategory.description,
        imageId
      );

      if (result) {
        // Refresh the categories list
        const updatedResult = await dbService.getAllCategories(
          currentPage,
          itemsPerPage
        );
        if (updatedResult) {
          setCategories(updatedResult.documents);
          setTotal(updatedResult.total);
        }

        toast({
          title: "Category added",
          description: "The category has been added successfully.",
        });

        // Reset form
        setNewCategory({ name: "", description: "" });
        setSelectedImage(null);
        setPreviewUrl(null);
        setIsAddDialogOpen(false);
      } else {
        throw new Error("Failed to add category");
      }
    } catch (error) {
      console.error("Failed to add category:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add category. Please try again later.",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const result = await dbService.deleteCategory(id);
      if (result) {
        setCategories(categories.filter((category) => category.id !== id));
        toast({
          title: "Category deleted",
          description: "The category has been deleted successfully.",
        });

        // If we've deleted the last item on this page, go to the previous page (unless we're on page 1)
        if (filteredCategories.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        throw new Error("Failed to delete category");
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category. Please try again later.",
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(total / itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Categories</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new product category.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  placeholder="Enter category name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter category description"
                  rows={3}
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Category Image</Label>
                <div
                  className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer"
                  onClick={handleFileUploadClick}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {previewUrl ? (
                    <div className="mx-auto w-32 h-32 rounded-md overflow-hidden mb-4">
                      <img
                        src={previewUrl}
                        alt="Category Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>
                  )}

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {previewUrl
                      ? "Click to change image"
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    SVG, PNG, JPG or GIF (max. 2MB)
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setSelectedImage(null);
                  setPreviewUrl(null);
                  setNewCategory({ name: "", description: "" });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Category Management</CardTitle>
          <CardDescription>
            Manage your product categories and subcategories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search categories..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Products
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-gray-500 dark:text-gray-400"
                    >
                      No categories found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img
                              src={
                                category.imageUrl ||
                                "/placeholder.svg?height=40&width=40"
                              }
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="font-medium">{category.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {category.description || "No description"}
                      </TableCell>
                      <TableCell>{category.productCount}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/categories/edit/${category.id}`}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
