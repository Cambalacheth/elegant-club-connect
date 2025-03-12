
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CreateEventData, EventFormProps } from "./types";
import { useEventForm } from "./form/useEventForm";
import { EventFormBasicFields } from "./form/EventFormBasicFields";
import { EventFormLocation } from "./form/EventFormLocation";
import { EventFormDateTime } from "./form/EventFormDateTime";
import { EventFormAdditionalFields } from "./form/EventFormAdditionalFields";
import { EventFormImage } from "./form/EventFormImage";

export const EventForm = ({ 
  initialData, 
  onSubmit, 
  isSubmitting 
}: EventFormProps) => {
  const { 
    form, 
    imagePreview, 
    setImagePreview, 
    revealDateLater, 
    setRevealDateLater, 
    revealLocationLater, 
    setRevealLocationLater,
    resetForm 
  } = useEventForm(initialData);

  const handleSubmit = async (data: CreateEventData) => {
    const formattedData = {
      ...data,
      image_url: imagePreview,
      event_date: revealDateLater ? null : data.event_date,
      location: revealLocationLater ? null : data.location
    };
    
    try {
      await onSubmit(formattedData);
      resetForm();
    } catch (error) {
      console.error("Error in form submission:", error);
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
                <EventFormBasicFields form={form} />
                <EventFormLocation 
                  form={form} 
                  revealLocationLater={revealLocationLater}
                  setRevealLocationLater={setRevealLocationLater}
                />
              </div>

              <div className="space-y-6">
                <EventFormDateTime 
                  form={form}
                  revealDateLater={revealDateLater}
                  setRevealDateLater={setRevealDateLater}
                />
                <EventFormAdditionalFields form={form} />
                <EventFormImage 
                  initialImage={imagePreview} 
                  onImageChange={setImagePreview} 
                />
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
