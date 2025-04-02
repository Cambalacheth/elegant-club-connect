
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Feedback {
  id: string;
  content: string;
  username: string | null;
  is_anonymous: boolean;
  created_at: string;
}

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setFeedbacks(data || []);
    } catch (error: any) {
      console.error('Error fetching feedback:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los comentarios',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Feedback</h2>
      
      {loading ? (
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-club-brown"></div>
        </div>
      ) : feedbacks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay feedback disponible</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <Card key={feedback.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base text-club-brown">
                    {feedback.is_anonymous
                      ? 'Usuario anónimo'
                      : feedback.username || 'Usuario sin registrar'}
                  </CardTitle>
                  <span className="text-xs text-gray-500">
                    {new Date(feedback.created_at).toLocaleString('es-ES')}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{feedback.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;
