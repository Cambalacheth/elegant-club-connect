
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface FeedbackFormProps {
  onSubmit: (content: string, isAnonymous: boolean) => void;
  loading: boolean;
  isLoggedIn: boolean;
}

const feedbackSchema = z.object({
  content: z.string().min(10, "Por favor, escribe al menos 10 caracteres.").max(1000, "El mensaje no puede exceder los 1000 caracteres."),
});

const FeedbackForm = ({ onSubmit, loading, isLoggedIn }: FeedbackFormProps) => {
  const [isAnonymous, setIsAnonymous] = useState(false);

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof feedbackSchema>) => {
    onSubmit(values.content, isAnonymous);
    form.reset();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Escribe aquí tu feedback, sugerencia o reporte..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isLoggedIn && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
                className="rounded border-gray-300 text-club-orange focus:ring-club-orange"
              />
              <label htmlFor="anonymous" className="text-sm text-club-brown">
                Enviar de forma anónima
              </label>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              className="bg-club-orange hover:bg-club-orange/90 text-white"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar feedback"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FeedbackForm;
