import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import dbService from "@/appwrite/database";

interface CategoryFormProps {
  id?: string;
  initialName?: string;
  isEdit?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  id,
  initialName = "",
  isEdit = false,
}) => {
  const [title, setTitle] = useState<string>(initialName);
  const [description, setDescription] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingImageId, setExistingImageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (isEdit && id) {
        try {
          setIsLoading(true);
          const categoryData = await dbService.getCategoryById(id);

          if (categoryData) {
            setTitle(categoryData.title || categoryData.name || "");
            setDescription(categoryData.description || "");

            if (categoryData.imageUrl) {
              setPreviewUrl(categoryData.imageUrl);
            }

            if (categoryData.imageId) {
              setExistingImageId(categoryData.imageId);
            }
          }
        } catch (error) {
          console.error("Error fetching category data:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load category data",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCategoryData();
  }, [isEdit, id, toast]);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Category name is required",
      });
      return;
    }

    try {
      setIsLoading(true);
      let imageId = existingImageId || "";

      // Upload new image if selected
      if (selectedImage) {
        const uploadResult = await dbService.uploadImage(selectedImage);
        if (uploadResult) {
          // If we had an existing image and are replacing it, delete the old one
          if (existingImageId) {
            try {
              await dbService.deleteImage(existingImageId);
            } catch (error) {
              console.error("Error deleting old image:", error);
              // Continue anyway - the new image was uploaded
            }
          }
          imageId = uploadResult.fileId;
        }
      }

      if (isEdit && id) {
        const result = await dbService.updateCategory(
          id,
          title,
          description,
          imageId
        );
        if (result) {
          toast({
            title: "Success",
            description: "Category updated successfully",
          });
          router.push("/admin/categories");
        } else {
          throw new Error("Failed to update category");
        }
      } else {
        const result = await dbService.addNewCategory(
          title,
          description,
          imageId
        );
        if (result) {
          toast({
            title: "Success",
            description: "Category added successfully",
          });
          router.push("/admin/categories");
        } else {
          throw new Error("Failed to add category");
        }
      }
    } catch (error) {
      console.error("Error in category form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error saving the category",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEdit) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading category data...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto w-full p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isEdit ? "Edit Category" : "Add New Category"}
      </h1>

      <div className="mb-4">
        <Label htmlFor="title">Category Name</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Category name"
          className="mt-1"
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Category description"
          rows={3}
          className="mt-1"
        />
      </div>

      <div className="mb-6">
        <Label htmlFor="image">Category Image</Label>
        <div
          className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer mt-1"
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

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.push("/admin/categories")}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              {isEdit ? "Updating..." : "Saving..."}
            </>
          ) : isEdit ? (
            "Update Category"
          ) : (
            "Save Category"
          )}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
