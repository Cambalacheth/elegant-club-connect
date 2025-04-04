import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Domain } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const domainSchema = z.object({
  name: z.string().min(2, {
    message: "Domain name must be at least 2 characters.",
  }),
  path: z.string().min(2, {
    message: "Path must be at least 2 characters.",
  }),
  description: z.string().optional(),
  status: z.enum(["available", "reserved", "used"]),
  owner: z.string().optional(),
  external_url: z.string().optional(),
});

const DomainManagement = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof domainSchema>>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      name: "",
      path: "",
      description: "",
      status: "available",
      owner: "",
      external_url: "",
    },
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("domains").select("*");
      if (error) throw error;
      setDomains(data as Domain[]);
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error fetching domains",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof domainSchema>) => {
    try {
      const { data, error } = await supabase.from("domains").insert([values]);
      if (error) throw error;
      toast({
        title: "Domain created",
        description: "Domain has been created successfully.",
      });
      fetchDomains(); // Refresh domains
      reset(); // Reset form fields
      setOpen(false); // Close the dialog
    } catch (error: any) {
      toast({
        title: "Error creating domain",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("domains").delete().eq("id", id);
      if (error) throw error;
      toast({
        title: "Domain deleted",
        description: "Domain has been deleted successfully.",
      });
      fetchDomains(); // Refresh domains
    } catch (error: any) {
      toast({
        title: "Error deleting domain",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string, updatedDomain: Domain) => {
    try {
      const { error } = await supabase
        .from("domains")
        .update(updatedDomain)
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast({
        title: "Domain updated",
        description: "Domain has been updated successfully.",
      });

      fetchDomains();
    } catch (error: any) {
      toast({
        title: "Error updating domain",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading domains...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Domain Management</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="primary">Create Domain</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Domain</DialogTitle>
              <DialogDescription>
                Add a new domain to the database.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Domain Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Path</FormLabel>
                      <FormControl>
                        <Input placeholder="Path" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="reserved">Reserved</SelectItem>
                          <SelectItem value="used">Used</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner</FormLabel>
                      <FormControl>
                        <Input placeholder="Owner" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="external_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>External URL</FormLabel>
                      <FormControl>
                        <Input placeholder="External URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" className="mr-2">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>A list of your domains.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Path</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>External URL</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domains.map((domain) => (
            <DomainRow
              key={domain.id}
              domain={domain}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface DomainRowProps {
  domain: Domain;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedDomain: Domain) => void;
}

const DomainRow: React.FC<DomainRowProps> = ({ domain, onDelete, onUpdate }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [updatedDomain, setUpdatedDomain] = useState<Domain>(domain);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedDomain(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    onUpdate(domain.id, updatedDomain);
    setIsEditOpen(false);
  };

  return (
    <TableRow key={domain.id}>
      <TableCell>{domain.name}</TableCell>
      <TableCell>{domain.path}</TableCell>
      <TableCell>{domain.description}</TableCell>
      <TableCell>{domain.status}</TableCell>
      <TableCell>{domain.owner || "-"}</TableCell>
      <TableCell>{domain.externalUrl || "-"}</TableCell>
      <TableCell className="text-right">
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Domain</DialogTitle>
              <DialogDescription>
                Make changes to the domain here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={updatedDomain.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="path" className="text-right">
                  Path
                </Label>
                <Input
                  type="text"
                  id="path"
                  name="path"
                  value={updatedDomain.path}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  value={updatedDomain.description || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select value={updatedDomain.status} onValueChange={(value) => handleInputChange({ target: { name: 'status', value } } as any)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="owner" className="text-right">
                  Owner
                </Label>
                <Input
                  type="text"
                  id="owner"
                  name="owner"
                  value={updatedDomain.owner || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="externalUrl" className="text-right">
                  External URL
                </Label>
                <Input
                  type="text"
                  id="externalUrl"
                  name="externalUrl"
                  value={updatedDomain.externalUrl || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="mr-2">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleUpdate}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="destructive" size="sm" onClick={() => onDelete(domain.id)}>
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default DomainManagement;
