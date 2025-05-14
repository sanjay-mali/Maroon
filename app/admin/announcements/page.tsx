"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import dbService from "@/appwrite/database";
import { Badge } from "@/components/ui/badge";

interface Announcement {
  $id: string;
  text: string;
  link?: string;
  isActive: boolean;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    text: "",
    link: "",
    isActive: true,
  });

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchAnnouncements();
  }, []);
  const fetchAnnouncements = async () => {
    try {
      const result = await dbService.getAllAnnouncements();
      if (result?.documents) {
        setAnnouncements(result.documents as unknown as Announcement[]);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast({
        title: "Error",
        description: "Failed to load announcements",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedAnnouncement) {
        await dbService.updateAnnouncement(selectedAnnouncement.$id, formData);
        toast({
          title: "Success",
          description: "Announcement updated successfully",
        });
      } else {
        await dbService.createAnnouncement(formData);
        toast({
          title: "Success",
          description: "Announcement created successfully",
        });
      }

      setIsAddDialogOpen(false);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error("Error saving announcement:", error);
      toast({
        title: "Error",
        description: "Failed to save announcement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      text: announcement.text,
      link: announcement.link || "",
      isActive: announcement.isActive,
    });
    setIsAddDialogOpen(true);
  };
  const handleDelete = async (announcementId: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    setIsLoading(true);
    try {
      await dbService.deleteAnnouncement(announcementId);
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      text: "",
      link: "",
      isActive: true,
    });
    setSelectedAnnouncement(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-gray-500">Manage announcement messages</p>
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
              Add Announcement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedAnnouncement
                  ? "Edit Announcement"
                  : "Add New Announcement"}
              </DialogTitle>
              <DialogDescription>
                Create or edit an announcement that will be displayed at the top
                of the website
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  value={formData.text}
                  onChange={(e) =>
                    setFormData({ ...formData, text: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Link URL (Optional)</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                />
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
                      {selectedAnnouncement ? "Updating..." : "Creating..."}
                    </>
                  ) : selectedAnnouncement ? (
                    "Update Announcement"
                  ) : (
                    "Create Announcement"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 animate-pulse mb-2 w-3/4" />
                <div className="h-4 bg-gray-200 animate-pulse w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="mt-2 font-semibold">No announcements found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Get started by creating a new announcement
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <Card key={announcement.$id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{announcement.text}</h3>
                      {announcement.link && (
                        <Badge variant="outline" className="text-xs">
                          Has Link
                        </Badge>
                      )}
                      <Badge
                        variant={
                          announcement.isActive ? "default" : "secondary"
                        }
                        className={
                          announcement.isActive
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {announcement.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(announcement)}
                      title="Edit Announcement"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(announcement.$id)}
                      title="Delete Announcement"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
