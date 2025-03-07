
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Phone, Mail, Link as LinkIcon, Vegan, AlertTriangle, Utensils, Plus, HelpCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  phone: z.string().min(9, { message: "Por favor ingresa un número de teléfono válido" }),
  email: z.string().email({ message: "Por favor ingresa un email válido" }),
  personalLink: z.string().url({ message: "Por favor ingresa una URL válida" }).optional().or(z.literal("")),
  dietaryRestrictions: z.string().optional(),
  dietaryPreference: z.string(),
  otherDietaryPreference: z.string().optional(),
  bringingGuests: z.boolean().default(false),
  guestNames: z.string().optional(),
  numberOfGuests: z.number().optional(),
  helpWithOrganization: z.boolean().default(false),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AsadoRegistration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      personalLink: "",
      dietaryRestrictions: "",
      dietaryPreference: "",
      otherDietaryPreference: "",
      bringingGuests: false,
      guestNames: "",
      numberOfGuests: 0,
      helpWithOrganization: false,
      additionalInfo: "",
    },
  });

  const dietaryPreference = form.watch("dietaryPreference");
  const bringingGuests = form.watch("bringingGuests");

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Save to Supabase
      const { error } = await supabase
        .from("asado_registrations")
        .insert({
          full_name: data.fullName,
          phone: data.phone,
          email: data.email,
          personal_link: data.personalLink || null,
          dietary_restrictions: data.dietaryRestrictions || null,
          dietary_preference: data.dietaryPreference,
          other_dietary_preference: data.otherDietaryPreference || null,
          bringing_guests: data.bringingGuests,
          guest_names: data.guestNames || null,
          number_of_guests: data.numberOfGuests || 0,
          help_with_organization: data.helpWithOrganization,
          additional_info: data.additionalInfo || null,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "¡Registro completado!",
        description: "Te hemos registrado para el asado. Pronto recibirás más información.",
      });
      
      // Optional: redirect after successful submission
      // navigate("/");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error al registrarse",
        description: error.message || "Ha ocurrido un error al enviar el formulario. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-club-beige py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="p-6 md:p-8 bg-white shadow-lg rounded-lg">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl text-club-brown font-bold">Gran Asado Gran</h1>
            <h2 className="font-serif text-xl md:text-2xl text-club-terracotta mt-2">Primer asado auspiciado por Terreta</h2>
            
            <div className="mt-6 space-y-2 text-club-brown">
              <p className="flex items-center justify-center gap-2">
                <span className="font-medium">Lugar:</span> A revelar, cercanías de Valencia
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="font-medium">Fecha:</span> Finales de abril, principios de mayo
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="font-medium">Precio:</span> ¿?
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" /> Nombre completo
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Número de teléfono
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+34 612 345 678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="tu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" /> Link personal (opcional)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://tu-sitio-web.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Tu website, LinkedIn, Instagram u otra red social
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dietaryRestrictions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> Alergias o restricciones alimentarias
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detalla cualquier alergia o restricción alimentaria aquí" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dietaryPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Utensils className="h-4 w-4" /> Preferencia dietaria
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu preferencia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="meat">Con carne</SelectItem>
                          <SelectItem value="vegetarian">Vegetariana</SelectItem>
                          <SelectItem value="vegan">Vegana</SelectItem>
                          <SelectItem value="other">Otra</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {dietaryPreference === "other" && (
                  <FormField
                    control={form.control}
                    name="otherDietaryPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Especificar otra preferencia</FormLabel>
                        <FormControl>
                          <Input placeholder="Describe tu preferencia dietaria" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="bringingGuests"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          <span className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Traeré acompañantes
                          </span>
                        </FormLabel>
                        <FormDescription>
                          Marca esta opción si vendrás con acompañantes
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {bringingGuests && (
                  <>
                    <FormField
                      control={form.control}
                      name="numberOfGuests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de acompañantes</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              value={field.value}
                            />
                          </FormControl>
                          <FormDescription>
                            El precio por acompañante será confirmado próximamente
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="guestNames"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombres de los acompañantes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Nombres de las personas que te acompañarán" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="helpWithOrganization"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          <span className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" /> Quiero ayudar en la organización
                          </span>
                        </FormLabel>
                        <FormDescription>
                          Marca esta opción si te gustaría colaborar con la organización del evento
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" /> ¿Algo más que quieras contarnos?
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Comparte cualquier otra información o pregunta que tengas" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-club-orange hover:bg-club-terracotta"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Registrarme para el asado"}
                {!isSubmitting && <Check className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AsadoRegistration;
