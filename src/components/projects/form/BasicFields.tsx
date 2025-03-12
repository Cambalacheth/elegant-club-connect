
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "../project-form-schema";

interface BasicFieldsProps {
  form: UseFormReturn<ProjectFormValues>;
  language: string;
}

const BasicFields = ({ form, language }: BasicFieldsProps) => {
  const nameLabel = language === "en" ? "Project Name" : "Nombre del Proyecto";
  const shortDescLabel = language === "en" ? "Short Description (max 220 chars)" : "Descripción Corta (máx 220 caracteres)";
  const longDescLabel = language === "en" ? "Long Description" : "Descripción Larga";
  const websiteLabel = language === "en" ? "Website URL (optional)" : "URL del Sitio Web (opcional)";
  const tagsLabel = language === "en" ? "Tags (comma separated, max 6)" : "Tags (separados por comas, máx 6)";

  return (
    <>
      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{nameLabel}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tagsLabel}</FormLabel>
            <FormControl>
              <Input {...field} placeholder="tech, web, app" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{shortDescLabel}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="long_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{longDescLabel}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="website_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{websiteLabel}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://yourproject.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default BasicFields;
