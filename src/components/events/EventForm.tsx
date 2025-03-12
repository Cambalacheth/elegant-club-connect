
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Event } from "@/types/event";

interface EventFormProps {
  initialData?: Partial<Event>;
  onSubmit: (data: Partial<Event>) => Promise<void>;
  isSubmitting: boolean;
}

export const EventForm = ({ 
  initialData, 
  onSubmit, 
  isSubmitting 
}: EventFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const [revealDateLater, setRevealDateLater] = useState<boolean>(!initialData?.event_date);
  const [revealLocationLater, setRevealLocationLater] = useState<boolean>(!initialData?.location);
  
  const form = useForm<Partial<Event>>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      price: initialData?.price || "",
      reservation_link: initialData?.reservation_link || "",
      event_date: initialData?.event_date ? new Date(initialData.event_date).toISOString().slice(0, 16) : ""
    }
  });

  const handleSubmit = async (data: Partial<Event>) => {
    const formattedData = {
      ...data,
      image_url: imagePreview,
      // Handle the "reveal later" options
      event_date: revealDateLater ? null : data.event_date,
      location: revealLocationLater ? null : data.location
    };
    
    try {
      await onSubmit(formattedData);
      form.reset({
        title: "",
        description: "",
        location: "",
        price: "",
        reservation_link: "",
        event_date: ""
      });
      setImagePreview(null);
      setRevealDateLater(false);
      setRevealLocationLater(false);
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getFormTitle = () => {
    return initialData?.id ? 'Editar evento' : 'Crear nuevo evento';
  };

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="bg-gradient-to-r from-club-orange/90 to-club-terracotta/90 text-white rounded-t-lg">
        <CardTitle className="text-xl font-semibold">
          {getFormTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Título del evento" {...field} required />
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
                      <FormLabel>Descripción <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descripción del evento" 
                          className="min-h-32" 
                          {...field} 
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación</FormLabel>
                      <div className="space-y-2">
                        <FormControl>
                          <Input 
                            placeholder="Ubicación del evento" 
                            {...field} 
                            disabled={revealLocationLater}
                          />
                        </FormControl>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="reveal-location-later" 
                            checked={revealLocationLater}
                            onCheckedChange={(checked) => {
                              setRevealLocationLater(checked as boolean);
                              if (checked) {
                                form.setValue('location', '');
                              }
                            }}
                          />
                          <label 
                            htmlFor="reveal-location-later" 
                            className="text-sm cursor-pointer"
                          >
                            Revelar ubicación más adelante
                          </label>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="event_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha y hora</FormLabel>
                      <div className="space-y-2">
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field} 
                            disabled={revealDateLater}
                          />
                        </FormControl>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="reveal-date-later" 
                            checked={revealDateLater}
                            onCheckedChange={(checked) => {
                              setRevealDateLater(checked as boolean);
                              if (checked) {
                                form.setValue('event_date', '');
                              }
                            }}
                          />
                          <label 
                            htmlFor="reveal-date-later" 
                            className="text-sm cursor-pointer"
                          >
                            Revelar fecha más adelante
                          </label>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input placeholder="Precio del evento (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reservation_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enlace de reserva</FormLabel>
                      <FormControl>
                        <Input placeholder="Enlace para reservar (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <FormLabel>Imagen del evento</FormLabel>
                  <div className="flex flex-col items-center gap-4">
                    {imagePreview ? (
                      <div className="w-full h-48 overflow-hidden rounded-md border">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center rounded-md border border-dashed bg-gray-50">
                        <span className="text-gray-500 text-sm">Vista previa de la imagen</span>
                      </div>
                    )}
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <CardFooter className="flex justify-end p-0 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-club-orange to-club-terracotta hover:opacity-90 text-white font-medium shadow-md transition-all"
              >
                {isSubmitting 
                  ? "Guardando..." 
                  : initialData?.id 
                    ? "Actualizar" 
                    : "Crear"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
