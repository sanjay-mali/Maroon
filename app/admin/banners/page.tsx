"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import dbService from "@/appwrite/database";

interface Banner {
  $id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageId: string; // Store the Appwrite file ID
  imageUrl: string; // Store the actual image URL
  link: string;
  type: "hero" | "sale";
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const formatDateTimeLocal = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  // Pad with zeros for month, day, hours, minutes
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    link: "",
    type: "hero" as "hero" | "sale",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      // Pass array of filter strings
      const result = await dbService.listDocuments([], {
        orderBy: "startDate",
      });
      if (result?.documents) {
        setBanners(result.documents as unknown as Banner[]);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast({
        title: "Error",
        description: "Failed to load banners",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (4MB limit)
      if (file.size > 4 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should not exceed 4MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      link: banner.link,
      type: banner.type,
      startDate: formatDateTimeLocal(banner.startDate),
      endDate: formatDateTimeLocal(banner.endDate),
      isActive: banner.isActive,
    });
    setImagePreview(banner.imageUrl);
    setIsAddDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageData = selectedBanner
        ? {
            imageId: selectedBanner.imageId,
            imageUrl: selectedBanner.imageUrl,
          }
        : { imageId: "", imageUrl: "" };

      if (selectedImage) {
        const uploadResult = await dbService.uploadAndGetImageUrl(
          selectedImage
        );
        imageData = {
          imageId: uploadResult.fileId,
          imageUrl: uploadResult.imageUrl,
        };
      }

      const bannerData = {
        ...formData,
        imageId: imageData.imageId,
        imageUrl: imageData.imageUrl,
      };

      if (selectedBanner) {
        // If updating and there's an old image, delete it
        if (selectedBanner.imageId && selectedImage) {
          await dbService.deleteImageWithId(selectedBanner.imageId);
        }

        await dbService.updateDocument(selectedBanner.$id, bannerData);
        toast({
          title: "Success",
          description: "Banner updated successfully",
        });
      } else {
        await dbService.createDocument(bannerData);
        toast({
          title: "Success",
          description: "Banner created successfully",
        });
      }

      setIsAddDialogOpen(false);
      resetForm();
      fetchBanners();
    } catch (error) {
      console.error("Error saving banner:", error);
      toast({
        title: "Error",
        description: "Failed to save banner",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (bannerId: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    setIsLoading(true);
    try {
      const bannerToDelete = banners.find((b) => b.$id === bannerId);
      if (bannerToDelete?.imageId) {
        // Delete the image from storage first
        await dbService.deleteImageWithId(bannerToDelete.imageId);
      }

      await dbService.deleteDocument(bannerId);
      toast({
        title: "Success",
        description: "Banner deleted successfully",
      });
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      link: "",
      type: "hero",
      startDate: "",
      endDate: "",
      isActive: true,
    });
    setSelectedImage(null);
    setImagePreview("");
    setSelectedBanner(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Banners</h1>
          <p className="text-gray-500">Manage website banners</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedBanner ? "Edit Banner" : "Add New Banner"}
              </DialogTitle>
              <DialogDescription>
                Create or edit a banner for the website
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>{" "}
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bannerImage">Banner Image</Label>
                <div
                  className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  {imagePreview ? (
                    <div className="relative h-48">
                      <Image
                        src={imagePreview}
                        alt="Banner Preview"
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="py-8">
                      <p className="text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 2MB
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Link URL</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="w-full rounded-md border p-2"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "hero" | "sale",
                    })
                  }
                  required
                >
                  <option value="hero">Hero</option>
                  <option value="sale">Sale</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {selectedBanner ? "Updating..." : "Creating..."}
                    </>
                  ) : selectedBanner ? (
                    "Update Banner"
                  ) : (
                    "Create Banner"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-48 bg-gray-200 animate-pulse mb-4" />
                <div className="h-4 bg-gray-200 animate-pulse w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 animate-pulse w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : banners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="mt-2 font-semibold">No banners found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Get started by creating a new banner
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <Card key={banner.$id}>
              <CardContent className="p-4">
                <div className="relative h-48 mb-4">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{banner.title}</h3>
                  <div className="flex gap-2 items-center">
                    <Badge
                      variant={banner.type === "hero" ? "default" : "secondary"}
                    >
                      {banner.type === "hero" ? "Hero" : "Sale"}
                    </Badge>
                    <Badge variant={banner.isActive ? "default" : "secondary"}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  {new Date(banner.startDate).toLocaleDateString()} -{" "}
                  {new Date(banner.endDate).toLocaleDateString()}
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(banner)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(banner.$id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
