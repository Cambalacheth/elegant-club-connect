
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GuideFieldsProps {
  form: UseFormReturn<any>;
}

export const GuideFields = ({ form }: GuideFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-club-brown font-medium">Descripción o introducción</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Introducción de la guía" 
                className="min-h-[100px] border-club-beige-dark focus:border-club-orange" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-club-brown font-medium">Contenido principal</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Contenido detallado de la guía" 
                className="min-h-[250px] border-club-beige-dark focus:border-club-orange" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="difficulty"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-club-brown font-medium">Nivel de dificultad</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="border-club-beige-dark focus:border-club-orange">
                  <SelectValue placeholder="Selecciona el nivel de dificultad" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="basic">Básico</SelectItem>
                <SelectItem value="intermediate">Intermedio</SelectItem>
                <SelectItem value="advanced">Avanzado</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="source"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-club-brown font-medium">Fuente o autor</FormLabel>
            <FormControl>
              <Input 
                placeholder="Autor o creador de la guía" 
                {...field} 
                className="border-club-beige-dark focus:border-club-orange"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="downloadUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-club-brown font-medium">Enlace externo o descarga</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://..." 
                {...field} 
                className="border-club-beige-dark focus:border-club-orange"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
