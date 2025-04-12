
import { FormField } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ResourceTypeSelect } from "./ResourceTypeSelect";
import { ResourceDescription } from "./ResourceDescription";
import { ResourceFileUpload } from "./ResourceFileUpload";
import { ResourceSource } from "./ResourceSource";
import { ResourcePriceSelect } from "./ResourcePriceSelect";
import { useEffect } from "react";

interface ResourceFieldsProps {
  form: UseFormReturn<any>;
}

export const ResourceFields = ({ form }: ResourceFieldsProps) => {
  // Set published to true by default for resources
  useEffect(() => {
    form.setValue('published', true);
  }, [form]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="resourceType"
        render={({ field }) => (
          <ResourceTypeSelect field={field} />
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <ResourceDescription field={field} />
        )}
      />
      
      <FormField
        control={form.control}
        name="resourceUrl"
        render={({ field }) => (
          <ResourceFileUpload form={form} field={field} />
        )}
      />
      
      <FormField
        control={form.control}
        name="source"
        render={({ field }) => (
          <ResourceSource field={field} />
        )}
      />
      
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <ResourcePriceSelect field={field} />
        )}
      />
    </div>
  );
};
