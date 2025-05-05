"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import dbService from "@/appwrite/database";
import { UserData } from "@/types/user";

interface DisplayUser {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  orders: number;
  avatar?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageLimit] = useState(10);

  const { toast } = useToast();

  // Fetch users from Appwrite
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await dbService.getAllUsers(currentPage, pageLimit);

        if (response && response.documents) {
          const appwriteUsers = response.documents.map(
            (user: any): DisplayUser => {
              return {
                id: user.$id,
                name: user.name || "Unknown",
                email: user.email || "",
                status: user.isActive ? "active" : "blocked",
                role: user.role || "customer",
                orders: (user.orders || []).length,
                avatar: user.avatar || "/placeholder.svg",
              };
            }
          );

          setUsers(appwriteUsers);
          setTotalUsers(response.total);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          variant: "destructive",
          title: "Error fetching users",
          description: "There was a problem loading the user data.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [currentPage, toast]);

  // Filter users based on search query and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleBlockUser = async (userId: string) => {
    try {
      await dbService.blockUser(userId);
      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: "blocked" } : user
        )
      );
      toast({
        title: "User blocked",
        description: "The user has been blocked successfully.",
      });
    } catch (error) {
      console.error("Error blocking user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to block user. Please try again.",
      });
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await dbService.unblockUser(userId);
      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: "active" } : user
        )
      );
      toast({
        title: "User unblocked",
        description: "The user has been unblocked successfully.",
      });
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to unblock user. Please try again.",
      });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const maxPages = Math.ceil(totalUsers / pageLimit);
    if (currentPage < maxPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage user accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search by name or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Orders
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Last Active
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500 dark:text-gray-400"
                    >
                      No users found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                            />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.status === "active" ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Blocked
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                          className="capitalize"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.orders}</TableCell>
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
                              <Link href={`/admin/users/${user.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleBlockUser(user.id)}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Block User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-green-600 focus:text-green-600"
                                onClick={() => handleUnblockUser(user.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Unblock User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium">{filteredUsers.length}</span> of{" "}
              <span className="font-medium">{totalUsers}</span> users
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={
                  currentPage >= Math.ceil(totalUsers / pageLimit) || loading
                }
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
