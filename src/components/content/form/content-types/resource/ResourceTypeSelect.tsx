
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ControllerRenderProps } from "react-hook-form";

interface ResourceTypeSelectProps {
  field: ControllerRenderProps<any, "resourceType">;
}

export const ResourceTypeSelect = ({ field }: ResourceTypeSelectProps) => {
  return (
    <FormItem>
      <FormLabel className="text-club-brown font-medium">Tipo de recurso</FormLabel>
      <Select
        onValueChange={field.onChange}
        defaultValue={field.value}
      >
        <FormControl>
          <SelectTrigger className="border-club-beige-dark focus:border-club-orange">
            <SelectValue placeholder="Selecciona el tipo de recurso" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="template">Template</SelectItem>
          <SelectItem value="tool">Herramienta</SelectItem>
          <SelectItem value="book">Libro</SelectItem>
          <SelectItem value="course">Curso</SelectItem>
          <SelectItem value="software">Software</SelectItem>
          <SelectItem value="document">Documento</SelectItem>
          <SelectItem value="presentation">Presentación</SelectItem>
          <SelectItem value="spreadsheet">Hoja de cálculo</SelectItem>
          <SelectItem value="other">Otro</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};
