
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "./project-form-schema";

interface ProjectCategoriesSelectProps {
  form: UseFormReturn<ProjectFormValues>;
  language: string;
}

const ProjectCategoriesSelect = ({ form, language }: ProjectCategoriesSelectProps) => {
  const categoriesLabel = language === "en" ? "Categories" : "Categorías";
  const selectCategoriesText = language === "en" ? "Select at least one category" : "Selecciona al menos una categoría";
  
  // Categories
  const categoriesOptions = [
    { id: "Legal", label: language === "en" ? "Legal" : "Legal" },
    { id: "Tecnología", label: language === "en" ? "Technology" : "Tecnología" },
    { id: "Finanzas", label: language === "en" ? "Finance" : "Finanzas" },
    { id: "Audiovisual", label: language === "en" ? "Audiovisual" : "Audiovisual" },
    { id: "Comunidad", label: language === "en" ? "Community" : "Comunidad" },
    { id: "Salud", label: language === "en" ? "Health" : "Salud" },
  ];

  return (
    <div className="md:col-span-2">
      <FormField
        control={form.control}
        name="categories"
        render={() => (
          <FormItem>
            <FormLabel>{categoriesLabel}</FormLabel>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {selectCategoriesText}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categoriesOptions.map((category) => (
                  <FormField
                    key={category.id}
                    control={form.control}
                    name="categories"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={category.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(category.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, category.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== category.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {category.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProjectCategoriesSelect;
