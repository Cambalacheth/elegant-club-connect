
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "./project-form-schema";
import { getCategoryOptions } from "./utils/categoryOptions";
import CategoryCheckboxItem from "./form/CategoryCheckboxItem";

interface ProjectCategoriesSelectProps {
  form: UseFormReturn<ProjectFormValues>;
  language: string;
}

const ProjectCategoriesSelect = ({ form, language }: ProjectCategoriesSelectProps) => {
  const categoriesLabel = language === "en" ? "Categories" : "Categorías";
  const selectCategoriesText = language === "en" 
    ? "Select at least one category" 
    : "Selecciona al menos una categoría";
  
  const categoryOptions = getCategoryOptions(language);

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
                {categoryOptions.map((category) => (
                  <CategoryCheckboxItem
                    key={category.id}
                    category={category}
                    form={form}
                    language={language}
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
