
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface Category {
  id: string;
  label: string;
}

interface CategoriesSectionProps {
  form: UseFormReturn<any>;
  currentLanguage: string;
  categoriesOptions: Category[];
}

const CategoriesSection = ({ form, currentLanguage, categoriesOptions }: CategoriesSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="categories"
      render={() => (
        <FormItem>
          <FormLabel>{currentLanguage === "en" ? "Categories" : "Categorías"}</FormLabel>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {currentLanguage === "en" 
                ? "Select categories of interest" 
                : "Selecciona categorías de interés"}
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
                                ? field.onChange([...field.value || [], category.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: string) => value !== category.id
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
  );
};

export default CategoriesSection;
