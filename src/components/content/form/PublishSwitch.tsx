
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ContentItem } from "@/types/content";

interface PublishSwitchProps {
  form: UseFormReturn<Partial<ContentItem>>;
}

export const PublishSwitch = ({ form }: PublishSwitchProps) => {
  return (
    <FormField
      control={form.control}
      name="published"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-club-beige-dark bg-club-beige/30">
          <div className="space-y-0.5">
            <FormLabel className="text-base text-club-brown font-medium">Publicar</FormLabel>
            <p className="text-sm text-club-gray">
              {field.value 
                ? "El contenido será visible para todos los usuarios" 
                : "El contenido será solo visible para administradores"}
            </p>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-club-orange"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
