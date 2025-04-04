
// Import necessary components and libraries
import { useState, useEffect } from "react";
import { useDomains } from "@/hooks/useDomains";
import { supabase } from "@/integrations/supabase/client";
import { Domain } from "@/types/domain";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const DomainManagement = () => {
  const { domains, loading, error } = useDomains();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [newDomain, setNewDomain] = useState<Partial<Domain>>({
    name: "",
    path: "",
    description: "",
    status: "available",
  });

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "reserved":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "used":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDomain((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status: "available" | "reserved" | "used") => {
    setNewDomain((prev) => ({ ...prev, status }));
  };

  const addNewDomain = async () => {
    if (!newDomain.name || !newDomain.path) {
      toast({
        title: "Error",
        description: "Name and path are required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoadingAction(true);
      
      // Insert a single new domain
      const { error } = await supabase.from("domains").insert([{
        name: newDomain.name,
        path: newDomain.path,
        description: newDomain.description || "",
        status: newDomain.status || "available",
      }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Domain added successfully",
        variant: "default",
      });

      setIsAddDialogOpen(false);
      setNewDomain({
        name: "",
        path: "",
        description: "",
        status: "available",
      });
      
      // Force reload after 1 second to allow DB to update
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      console.error("Error adding domain:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add domain",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(false);
    }
  };

  const deleteDomain = async (id: string) => {
    try {
      setLoadingAction(true);
      const { error } = await supabase.from("domains").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Domain deleted successfully",
        variant: "default",
      });
      
      // Force reload after 1 second to allow DB to update
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      console.error("Error deleting domain:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete domain",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Domain Management</CardTitle>
        <CardDescription>
          Manage available domains and their statuses
        </CardDescription>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          variant="outline"
          className="mt-2"
        >
          Add New Domain
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading domains...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            Error loading domains: {error}
          </div>
        ) : (
          <div className="overflow-auto max-h-[500px]">
            <Table className="min-w-full">
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell className="font-medium">{domain.name}</TableCell>
                    <TableCell>{domain.path}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {domain.description}
                    </TableCell>
                    <TableCell>
                      <Badge className={getBadgeColor(domain.status)}>
                        {domain.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteDomain(domain.id)}
                        disabled={loadingAction}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Domain</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                name="name"
                value={newDomain.name}
                onChange={handleInputChange}
                placeholder="e.g. Legal"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="path">Path</label>
              <Input
                id="path"
                name="path"
                value={newDomain.path}
                onChange={handleInputChange}
                placeholder="e.g. /legal"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description">Description</label>
              <Input
                id="description"
                name="description"
                value={newDomain.description}
                onChange={handleInputChange}
                placeholder="Domain description"
              />
            </div>
            <div className="grid gap-2">
              <label>Status</label>
              <div className="flex space-x-2">
                <Button
                  variant={newDomain.status === "available" ? "default" : "outline"}
                  onClick={() => handleStatusChange("available")}
                  className={
                    newDomain.status === "available"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  Available
                </Button>
                <Button
                  variant={newDomain.status === "reserved" ? "default" : "outline"}
                  onClick={() => handleStatusChange("reserved")}
                  className={
                    newDomain.status === "reserved"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : ""
                  }
                >
                  Reserved
                </Button>
                <Button
                  variant={newDomain.status === "used" ? "default" : "outline"}
                  onClick={() => handleStatusChange("used")}
                  className={
                    newDomain.status === "used"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : ""
                  }
                >
                  Used
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addNewDomain} disabled={loadingAction}>
              {loadingAction ? "Adding..." : "Add Domain"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DomainManagement;
