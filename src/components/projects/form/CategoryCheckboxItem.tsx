
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormValues } from "../project-form-schema";
import { CategoryOption } from "../utils/categoryOptions";

interface CategoryCheckboxItemProps {
  category: CategoryOption;
  form: UseFormReturn<ProjectFormValues>;
  language: string;
}

const CategoryCheckboxItem = ({ category, form, language }: CategoryCheckboxItemProps) => {
  const displayLabel = language === "en" ? category.label.en : category.label.es;

  return (
    <FormField
      key={category.id}
      control={form.control}
      name="categories"
      render={({ field }) => {
        return (
          <FormItem
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
              {displayLabel}
            </FormLabel>
          </FormItem>
        )
      }}
    />
  );
};

export default CategoryCheckboxItem;
