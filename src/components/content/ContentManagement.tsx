
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

export interface ContentManagementProps {
  userId: string;
  userRole: string;
}

export const ContentManagement: React.FC<ContentManagementProps> = ({ userId, userRole }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de contenido</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Funcionalidad desactivada</AlertTitle>
          <AlertDescription>
            La gestión de contenido ha sido desactivada. Esta funcionalidad ya no está disponible.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
